import { Storage } from "aws-amplify";
Storage.configure({ level: "private" });

export async function s3Upload(file) {
    const filename = `${Date.now()}-${file.name}`;
    const stored = await Storage.vault.put(filename, file, {
        contentType: file.type
    });
    return stored.key;
}