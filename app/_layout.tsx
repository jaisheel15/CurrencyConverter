import { Stack } from "expo-router";
import '../global.css'
import { RootSiblingParent } from 'react-native-root-siblings';
import CurrencyConverter from "./CurrencyConverter";
export default function RootLayout() {
  return (
<RootSiblingParent>

  <CurrencyConverter />
</RootSiblingParent>
)
}
