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

export const getDataAvailableStatus = async () => {
    const status = await AsyncStorage.getItem("isDataAvailable");
    console.log("Data available status:", status);
    return status == null ? false : status === "true";
}

export const setDataAvailableStatus = async (status: boolean) => {
    try {
        await AsyncStorage.setItem("isDataAvailable", status.toString());
        console.log("Data available status set to:", status);
    } catch (error) {
        console.error("Error setting data available status:", error);
    }
}

export const getOfflineData = async () => {
    try {
        const offlineData = await AsyncStorage.getItem("offlineData");
        console.log("Retrieved Offline Data from AsyncStorage:", offlineData);
        return offlineData ?? null;
    } catch (error) {
        console.error("Error retrieving offline data:", error);
        return null;
    }
}

export const setOfflineData = async (data) => {
    try {
        await AsyncStorage.setItem("offlineData", data);
        console.log("Offline data set in AsyncStorage:", data);
    } catch (error) {
        console.error("Error setting offline data:", error);
    }
}