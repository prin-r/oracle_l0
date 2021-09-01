use obi::{OBIDecode, OBIEncode, OBISchema};
use owasm::{execute_entry_point, ext, oei, prepare_entry_point};

extern crate hex;

#[derive(OBIDecode, OBISchema)]
struct Input {
    chain: String,
    contract_address: Vec<u8>,
    block_number: u64,
}

#[derive(OBIEncode, OBISchema)]
struct Output {
    chain_id: u16,
    block_hash: Vec<u8>,
    state_root: Vec<u8>,
    transaction_root: Vec<u8>,
}

// Supported Chains
const ETH: i64 = 0;

// Data Sources
const GBFL0_DS: i64 = 95;

fn chain_name_to_id(chain_name: String) -> i64 {
    match chain_name.as_str() {
        "ETH" => ETH,
        _ => panic!("unsupported chain {:?}", chain_name),
    }
}

fn prepare_impl(input: Input) {
    if input.contract_address.len() != 20 {
        panic!("address must be 20 bytes");
    }
    let chain_id = chain_name_to_id(input.chain);
    oei::ask_external_data(
        chain_id,
        GBFL0_DS,
        &input.block_number.clone().to_string().as_bytes(),
    );
}

#[no_mangle]
fn execute_impl(input: Input) -> Output {
    let chain_id = chain_name_to_id(input.chain);
    let source_result: &String = &ext::load_majority::<String>(chain_id).unwrap();
    let result = source_result.replace("0x", "");

    let result_vec = result.split(" ").collect::<Vec<&str>>();
    Output {
        chain_id: chain_id as u16,
        block_hash: hex::decode(&result_vec[0]).expect("Decoding block_hash failed"),
        state_root: hex::decode(&result_vec[1]).expect("Decoding state_root failed"),
        transaction_root: hex::decode(&result_vec[2]).expect("Decoding transaction_root failed"),
    }
}

prepare_entry_point!(prepare_impl);
execute_entry_point!(execute_impl);

#[cfg(test)]
mod tests {
    use super::*;
    use obi::get_schema;
    use std::collections::*;

    // #[test]
    // fn test_get_schema() {
    //     let mut answers: Vec<String> = vec![String::from("0xCDC2F106E9694B16FFDBFCE2A2612076CE44B4FE 0x29055EBAF0A927192C392A5619F781506FEF98BA 0x016345785D8A0000"),String::from("0xCDC2F106E9694B16FFDBFCE2A2612076CE44B4FE 0x29055EBAF0A927192C392A5619F781506FEF98BA 0x016345785D8A0000")];
    //     let reference_error_string: String = String::from(
    //   "0x0000000000000000000000000000000000000000 0x0000000000000000000000000000000000000000 0x00",
    // );

    //     let sources = chain_name_to_source_list(chain_name_to_id("ETH".to_string()));
    //     let mut source_results = Vec::new();
    //     for (id, supported) in sources.iter().enumerate() {
    //         if *supported {
    //             let mut source_result = &answers[id];
    //             assert_ne!(*source_result, reference_error_string);
    //             let result = source_result.replace("0x", "");
    //             source_results.push(result);
    //         }
    //     }
    //     let set: HashSet<String> = source_results.clone().into_iter().collect();
    //     assert!(set.len() == 1);
    //     let result_vec = source_results[0].split(" ").collect::<Vec<&str>>();
    //     let output = Output {
    //         from: hex::decode(&result_vec[0]).expect("Decoding failed"),
    //         to: hex::decode(&result_vec[1]).expect("Decoding failed"),
    //         amount: hex::decode(&result_vec[2]).expect("Decoding failed"),
    //     };
    //     println!("{:?}", output.to);
    // }
}
