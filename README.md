# exo_s1

## Install

Install **bun**
`curl -fsSL https://bun.sh/install | bash`

`bun --help`

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.20. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

If you occure this problem: `bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)`, resolve it by running the following command `npm rebuild`

## Commands

- `bun run cli.ts wallet --name <name>` : Create \<name>.wallet.json file, with key pair in it !
- `bun run balance --name <name>` : Get balance of an \<name> account wallet !
- `bun run airdrop --name <name> --amount <amount>` : Get balance of \<amount> SOL for \<name> account wallet !
- `bun run transfer --from <fromName> --to <toName> --amount <amount>` : Transfer \<amount> SOL from \<fromName> to \<toName> !

Running local validator : `solana-test-validator --reset`


## Resources

- [bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?) when importing Connection from @solana/web3.js - Solana Stack Exchange](https://solana.stackexchange.com/questions/4077/bigint-failed-to-load-bindings-pure-js-will-be-used-try-npm-run-rebuild-whe)
- [Solana Devnet Faucet - Airdrop SOL](https://faucet.solana.com/)