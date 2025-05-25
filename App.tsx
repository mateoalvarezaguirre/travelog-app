import AppNavigator from "./src/navigation/AppNavigator";
import AuthStack from "./src/navigation/AuthStack";
import {NavigationContainer} from "@react-navigation/native";
import {AuthContext, AuthProvider} from "./src/context/AuthContext";

export default function App() {

  return (
      <AuthProvider>
        <NavigationContainer>
            <AuthContext.Consumer>
                {({ userToken }) =>
                userToken ? <AppNavigator/> : <AuthStack/>
                }
            </AuthContext.Consumer>
        </NavigationContainer>
      </AuthProvider>
  );
}
