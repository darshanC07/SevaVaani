import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserId = async (): Promise<string | null> => {
    try {
        const userId = await AsyncStorage.getItem("userId");
        console.log("Retrieved User ID from AsyncStorage:", userId);
        return userId ?? null;
    } catch (error) {
        console.error("Error retrieving user ID:", error);
        return null;
    }
};

export const getUserName = async (): Promise<string | null> => {
    try {
        const userName = await AsyncStorage.getItem("name");
        console.log("Retrieved User Name from AsyncStorage:", userName);
        return userName ?? null;
    } catch (error) {
        console.error("Error retrieving user name:", error);
        return null;
    };
};
