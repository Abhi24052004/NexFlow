import Cryptr from "cryptr";

let cryptr: Cryptr | null = null;

const getCryptr = () => {
	if (cryptr) return cryptr;

	const encryptionKey = process.env.ENCRYPTION_KEY;
	if (!encryptionKey) {
		throw new Error(
			"Missing ENCRYPTION_KEY environment variable. Set ENCRYPTION_KEY in your .env file."
		);
	}

	cryptr = new Cryptr(encryptionKey);
	return cryptr;
};

export const encrypt = (text: string) => getCryptr().encrypt(text);
export const decrypt = (text: string) => getCryptr().decrypt(text);
