import "./App.css";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { polygonAmoy } from 'viem/chains';
import { Passport } from "@credenza3/passport-evm";
import { useEffect, useState } from "react";

function App() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const embedded = wallets.find(w => w.walletClientType === 'privy');
  const [passport, setPassport] = useState(null);

  useEffect(() => {
    if (!embedded || passport) return
    async function initPass() {
      const privyProvider = await embedded.getEthereumProvider();
      const passport = new Passport({
        chainId: String(polygonAmoy.id),
        clientId: "67039801735659a157687bfb",
        provider: privyProvider,
        config: {
          recieptTarget: "phone",
          content: {
            // cloak: true,
          },
          nav: {
            theme: Passport.themes.WHITE,
            direction: Passport.navDirections.TOP,
          },
        },
      });

      await passport.init();
      passport.showNavigation(
        { bottom: "0", right: "0" },
        {
          minimization: {
            toggler: {
              enabled: true,
            },
          },
        }
      );

      setPassport(passport);
    }
    initPass()
  }, [embedded]);

  const onLogout = async () => {
    await logout()
    await passport.logout();
    passport.hideNavigation()
    setPassport(null)
  }

    // Wait until the Privy client is ready before taking any actions
  if (!ready) {
    return null;
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* If the user is not authenticated, show a login button */}
        {/* If the user is authenticated, show the user object and a logout button */}
        {ready && authenticated ? (
          <div>
            <textarea
              readOnly
              value={JSON.stringify(user, null, 2)}
              style={{ width: "600px", height: "250px", borderRadius: "6px" }}
            />
            <br />
            <button onClick={onLogout} style={{ marginTop: "20px", padding: "12px", backgroundColor: "#069478", color: "#FFF", border: "none", borderRadius: "6px" }}>
              Log Out
            </button>
          </div>
        ) : (
          <button onClick={login} style={{padding: "12px", backgroundColor: "#069478", color: "#FFF", border: "none", borderRadius: "6px" }}>Log In</button>
        )}
      </header>
    </div>
  );
}

export default App;
