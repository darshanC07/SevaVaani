import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import NavBar from "@/components/NavBar";
import BottomNavBar from "@/components/BottomNavBar";
import { useTranslation } from "react-i18next";
import { getUserId } from "@/utils/AsyncStorageUtils";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWalletDetails } from "@/services/GlobalAPIs";

const Wallet = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.toLocaleLowerCase();

  const walletBalance = 2500;
  const upiId = "123456790@svl";

  const [user, setUser] = useState<string | null>('');
  const [name, setName] = useState<string | null>('');
  const [email, setEmail] = useState<string | null>('');

  const [earnings, setEarnings] = useState(0);
  const [transactionsList, setTransactionsList] = useState([]);

  const transactions = [
    { job_id: 1, client_name: "Aryan", timestamp: "2026-02-25T23:42:24.601635", amount: 500, type: "debit" },
    { job_id: 2, client_name: "Aryan", timestamp: "2026-02-25T23:42:24.601635", amount: 830, type: "debit" },
    { job_id: 3, client_name: "Shankar", timestampte: "2026-02-25T23:42:24.601635", amount: 1000, type: "credit" },
    { job_id: 4, client_name: "Aryan", timestamp: "2026-02-25T23:42:24.601635", amount: 460, type: "debit" },
  ];

  const getWallet = async (userId: string, language: string) => {
    try {
      const response = await getWalletDetails(userId, language);
      if (response) {
        console.log("Wallet details fetched successfully:", response);
        // transactions.push(...response.transactions);
        // setTransactionsList(transactions);
        setTransactionsList(response.transactions);
        setEarnings(response.earnings);
      }
    } catch (error) {
      setEarnings(0);
      setTransactionsList([]);
      console.log("Error fetching wallet details:", error);
    }
  }

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserId();
      console.log("Fetched User ID:", userId);
      if (!userId) {
        router.replace("/login");
      }
      const uname = await AsyncStorage.getItem("name");
      const uemail = await AsyncStorage.getItem("email");
      setUser(userId);
      setName(uname);
      setEmail(uemail);
      getWallet(userId, currentLanguage);
    }
    fetchUserId();
  }, [])

  function formatDateShort(dateString) {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });

    return `${day} ${month}`;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F8" }}>
      <NavBar />

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.headerContainer}>
          <View style={styles.horizontalLine} />
          <Text style={styles.title}>Wallet</Text>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceText}>
              {earnings.toLocaleString()}
            </Text>

            <View style={styles.rewardBadge}>
              <Feather name="gift" size={15} color="#2E9E44" />
              <Text style={styles.rewardText}> Reward</Text>
            </View>
          </View>

          <Text style={styles.upiText}>UPI ID: {upiId}</Text>

          <View style={styles.actionRow}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity style={styles.smallBtn}>
                <Text style={styles.smallBtnText}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.smallBtn, { marginLeft: 8 }]}>
                <Feather name="share-2" size={13} color="#333" />
                <Text style={styles.smallBtnText}> Share</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addMoneyBtn}>
              <Text style={styles.addMoneyText}>Add Money</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickActionsRow}>
          <View style={styles.quickActionItem}>
            <View style={styles.quickIconBox}>
              <MaterialCommunityIcons name="arrow-up-bold-outline" size={26} />
            </View>
            <Text style={styles.quickLabel}>Send</Text>
          </View>

          <View style={styles.quickActionItem}>
            <View style={styles.quickIconBox}>
              <MaterialCommunityIcons name="arrow-down-bold-outline" size={26} />
            </View>
            <Text style={styles.quickLabel}>Receive</Text>
          </View>

          <View style={styles.quickActionItem}>
            <View style={styles.quickIconBox}>
              <Feather name="archive" size={24} />
            </View>
            <Text style={styles.quickLabel}>Withdraw</Text>
          </View>

          <View style={styles.quickActionItem}>
            <View style={styles.quickIconBox}>
              <Ionicons name="grid-outline" size={24} />
            </View>
            <Text style={styles.quickLabel}>More</Text>
          </View>
        </View>

        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>Transactions</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        {transactionsList.length > 0 ? transactionsList.map((item,index) => (
          <View key={index} style={styles.transactionCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name={
                  item.type === "debit"
                    ? "arrow-up-bold-outline"
                    : "arrow-down-bold-outline"
                }
                size={22}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.transactionName}>{item.client_name}</Text>
                <Text style={styles.transactionDate}>{formatDateShort(item.timestamp)}</Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={[
                  styles.transactionAmount,
                  item.type === "credit" && { color: "#2E9E44" },
                ]}
              >
                {item.type === "credit"
                  ? `+ ₹ ${item.amount}`
                  : `- ₹ ${item.amount}`}
              </Text>
              <Text style={styles.transactionType}>
                {item.type === "credit" ? "Received" : "Sent"}
              </Text>
            </View>
          </View>
        )) : <Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>No transactions yet</Text>}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#4560F4",
    paddingBottom: 60,
    alignItems: "center",
  },

  horizontalLine: {
    height: 1,
    width: "90%",
    backgroundColor: "white",
    marginTop: 12,
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
  },

  wave: {
    position: "absolute",
    bottom: -60,
    width: "120%",
    height: 120,
    backgroundColor: "#F3F4F8",
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
  },

  balanceCard: {
    backgroundColor: "white",
    marginHorizontal: 18,
    marginTop: -50,
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: "#4560F4",
    elevation: 6,
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  balanceText: {
    fontSize: 30,
    fontWeight: "800",
  },

  rewardBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D8F5DE",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  rewardText: {
    color: "#2E9E44",
    fontWeight: "700",
    fontSize: 13,
  },

  upiText: {
    marginTop: 10,
    fontSize: 14,
    color: "#444",
  },

  actionRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smallBtn: {
    borderWidth: 1,
    borderColor: "#CCC",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },

  smallBtnText: {
    fontSize: 12,
    color: "#333",
  },

  addMoneyBtn: {
    backgroundColor: "#4F63FF",
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 10,
  },

  addMoneyText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },

  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 28,
  },

  quickActionItem: {
    alignItems: "center",
  },

  quickIconBox: {
    backgroundColor: "#C9D8F5",
    width: 65,
    height: 65,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  quickLabel: {
    marginTop: 8,
    fontWeight: "700",
    fontSize: 14,
  },

  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 26,
    alignItems: "center",
  },

  transactionTitle: {
    fontSize: 22,
    fontWeight: "800",
  },

  seeAll: {
    color: "#2E80D7",
    fontWeight: "700",
    fontSize: 15,
  },

  transactionCard: {
    backgroundColor: "white",
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  transactionName: {
    fontSize: 16,
    fontWeight: "700",
  },

  transactionDate: {
    color: "#777",
    marginTop: 2,
    fontSize: 13,
  },

  transactionAmount: {
    fontSize: 18,
    fontWeight: "800",
  },

  transactionType: {
    color: "#777",
    marginTop: 3,
    fontSize: 13,
  },
});