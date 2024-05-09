import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";
export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.roma.aora",
    projectId: "663c90fc002dc8e3f1ab",
    databaseId: "663c9344001437f35089",
    userCollectionId: "663c9379003dbd6195a8",
    videoCollectionId: "663c93d500121bcae30c",
    storangeId: "663c9606002d476a931e",
};

const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error) {
        throw new Error(error);
    }
}

// Sign In
export async function signIn(email, password) {
    try {
        const session = await account.createEmailSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}
