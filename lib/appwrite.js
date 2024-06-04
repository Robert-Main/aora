import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
} from "react-native-appwrite";
export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.romah.aora",
    projectId: "663e11d10021ea317d76",
    databaseId: "663e137e0008f45982ad",
    userCollectionId: "663e13a6000bd75e465e",
    videoCollectionId: "663e13d800176cc2ac20",
    storageId: "6654bc3e00329e1f62ce",
};

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;

const client = new Client();

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

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
            databaseId,
            userCollectionId,
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

export async function signIn(email, password) {
    try {
        const session = await account.createEmailSession(email, password);
        // console.log(session);
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        throw Error(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw Error;
        const user = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );
        if (!user) throw Error;

        return user.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getAllPosts = async () => {
    try {
        const post = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc("$createdAt")]
        );
        return post.documents;
    } catch (error) {
        throw Error(error);
    }
};

export async function getLatestPosts() {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        );
        console.log(posts);
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export async function searchPosts(query) {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search("title", query)]
        );

        if (!posts) throw new Error("Something went wrong");

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getUserPosts(userId) {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal("creator", userId)]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const sigOut = async () => {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        throw new Error(error);
    }
};

export async function uploadFile(file, type) {
    if (!file) return;
    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    };

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        );
        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
    let fileUrl;

    try {
        if (type === "video") {
            fileUrl = storage.getFileView(storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(
                storageId,
                fileId,
                2000,
                2000,
                "top",
                100
            );
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

// Create Video Post
export async function createVideoPost(form) {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
        ]);

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId,
            }
        );

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getUserLikedPosts(userId) {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal("likes", userId)]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}
export async function likePost(postId, userId) {
    try {
        const post = await databases.getDocument(
            databaseId,
            videoCollectionId,
            postId
        );

        if (post.likes && post.likes === userId) {
            post.likes = null;
        } else {
            post.likes = userId;
        }

        const updatedPost = await databases.updateDocument(
            databaseId,
            videoCollectionId,
            postId,
            { likes: post.likes }
        );

        return updatedPost;
    } catch (error) {
        throw new Error(`Failed to like/unlike the post: ${error.message}`);
    }
}
