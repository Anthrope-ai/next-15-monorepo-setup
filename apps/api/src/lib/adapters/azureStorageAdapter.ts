import { BlobServiceClient, ContainerClient, BlockBlobClient, BlobSASPermissions, SASProtocol } from "@azure/storage-blob";
import { v4 as uuidV4 } from "uuid";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!;
if (!connectionString) {
  throw new Error("Azure Storage Connection String is missing.");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

const getContainerClient = (containerName: string): ContainerClient => {
  if (!containerName) throw new Error("Container name is required.");
  return blobServiceClient.getContainerClient(containerName);
};

export const uploadFile = async (file: File, container: string = "talent-tap-profile-images"): Promise<string> => {
  const containerClient = getContainerClient(container);
  const blobName = `${uuidV4()}-${file.name}`;
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);

  const arrayBuffer = await file.arrayBuffer();
  await blockBlobClient.uploadData(Buffer.from(arrayBuffer));

  return blockBlobClient.url.replace(`${containerClient.url}/`, "");
};

export const downloadFile = async (fileKey: string, container: string = "talent-tap-profile-images"): Promise<Blob> => {
  const containerClient = getContainerClient(container);
  const blockBlobClient = containerClient.getBlockBlobClient(fileKey);

  const downloadResponse = await blockBlobClient.download();
  return downloadResponse.blobBody!;
};

export const getPublicUrl = async (fileKey: string, expiry: number = 15, container: string = "talent-tap-profile-images"): Promise<string> => {
  const containerClient = getContainerClient(container);
  const blockBlobClient = containerClient.getBlockBlobClient(fileKey);

  const startsOnDate = new Date();
  const expiresOnDate = new Date();
  expiresOnDate.setMinutes(startsOnDate.getMinutes() + expiry);

  return blockBlobClient.generateSasUrl({
    permissions: BlobSASPermissions.parse("read"),
    protocol: SASProtocol.Https,
    startsOn: startsOnDate,
    expiresOn: expiresOnDate,
  });
};