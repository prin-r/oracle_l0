use obi::{OBIDecode, OBIEncode, OBISchema};
use owasm::{execute_entry_point, ext, oei, prepare_entry_point};

extern crate hex;

#[derive(OBIDecode, OBISchema)]
struct Input {
    chain_id: u16,
    remote_chain_id: u16,
    contract_address: Vec<u8>,
    block_confirmations: u64,
    block_number: u64,
}

#[derive(OBIEncode, OBISchema)]
struct Output {
    remote_chain_id: u16,
    block_hash: Vec<u8>,
    confirmations: u64,
    receipts_root: Vec<u8>,
}

// Data Source ID
const DS_ID: i64 = 238;

// Fixed external_id
const EXTERNAL_ID: i64 = 0;

fn prepare_impl(input: Input) {
    if input.contract_address.len() != 20 {
        panic!("address must be 20 bytes");
    }
    oei::ask_external_data(
        EXTERNAL_ID,
        DS_ID,
        format!("{} {} {}", input.chain_id, input.block_confirmations, input.block_number).as_bytes()
    );
}

#[no_mangle]
fn execute_impl(input: Input) -> Output {
    let source_result: &String = &ext::load_majority::<String>(EXTERNAL_ID).unwrap();
    let result = source_result.replace("0x", "");

    let result_vec = result.split(" ").collect::<Vec<&str>>();
    Output {
        remote_chain_id: input.remote_chain_id,
        block_hash: hex::decode(&result_vec[0]).expect("Decoding block_hash failed"),
        confirmations: result_vec[1].parse::<u64>().unwrap(),
        receipts_root: hex::decode(&result_vec[2]).expect("Decoding receipts_root failed"),
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
}
