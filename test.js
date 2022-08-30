const { Connection, programs } = require('@metaplex/js');

const connection = new Connection('devnet');
const tokenPublicKey = 'Gz3vYbpsB2agTsAwedtvtTkQ1CG9vsioqLW3r9ecNpvZ';

const run = async () => {
  try {
    const ownedMetadata = await programs.metadata.Metadata.load(connection, tokenPublicKey);
    console.log(ownedMetadata);
  } catch {
    console.log('Failed to fetch metadata');
  }
};

run();