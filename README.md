# AirTrace
![AirTrace](Screenshot_52.png)

Welcome to AirTrace, a decentralized application (dApp) built on the Polkadot Asset Hub to track and update baggage information using blockchain technology. This project enables customers and baggage handlers to interact securely with baggage data through a user-friendly interface.



## View to a transaction completed via our smart contract:
https://assethub-westend.subscan.io/tx/0xd01a37d04dbb6ab1fcff45df30b9e2b5117d167bce4a40d0b62dd3baea863f20?ref=hackernoon.com


## 📽️ Demo Video

- [Click here to watch the full demo video with explanation](LINK_TO_YOUR_DEMO_VIDEO)

*(Replace with your Loom or YouTube video link.)*

---

## 🖼️ UI Screenshots

| Screen | Screenshot |
|:------|:------------|
| Home Page (Connect Wallet) | ![Home](screenshots/photo_4931780521181163284_y.jpg) |
| Customer View (View Location) | ![Customer View](screenshots/photo_4931780521181163291_y.jpg) |
| Handler View (Update Location/Stage) | ![Handler View](screenshots/handler-view.png) |


*(Create a `/screenshots/` folder in your repo and upload your screenshots there.)*

---
## Smart Contract Functionality: 
 The smart contract is written in solidity and deployed via the Remix IDE.\
 The smart contract has two main functionalities: **To view the baggage information, and then to update the baggage information** (With more time, functionality would be added that ensures checks that ONLY verified baggage handlers can update baggage information)
 
 Here we have the functions: ``` storeBaggage , updateLocation, getBaggage ,completeBaggage```.  ```storeBaggage``` provides a way to create a new Baggage instance by assigning a BaggageID and initial airport location to a new instance of the "Baggage" structure; ```updateLocation``` a method to update the airport location and Location status (e.g. check-in,on plane, transfer, arrival), ```getBaggage``` a method to look at the location and location status given a baggage id (Baggage ID's will be generated with secure methods in later versions- currently accept any abitrary string), lastly ```completeBaggage``` was a later functionality such that upon baggage arrival to the final airport, the Baggage structure would have the ```completed``` bool become true, signifiying that specific baggage had been collected. 

 ## 

JFK , transfer, 123

BOS, check-in, 456

---

## 🛠️ How the Frontend Works

The frontend was built using **Next.js**, **React**, **TailwindCSS**, and **Viem**:

- Users **connect their MetaMask wallet** to the dApp.
- Handlers can **create** or **update** baggage information, signing blockchain transactions through MetaMask.
- Customers can **view baggage location and stage** by simply entering the Baggage ID (no transaction or gas fees required).
- We used **Viem's publicClient** for reading contract state and **walletClient** for signing transactions.
- Everything is deployed over Polkadot’s **Asset Hub**, taking advantage of **low gas fees**, **fast finality**, and **EVM compatibility**.

---

## 🔎 Block Explorer Link

- [View Deployed Smart Contract on Asset Hub Explorer](Lhttps://assethub-westend.subscan.io/tx/0xd01a37d04dbb6ab1fcff45df30b9e2b5117d167bce4a40d0b62dd3baea863f20?ref=hackernoon.com)

*(Paste your Polkadot Asset Hub block explorer link here — example: BlockScout/Subscan.)*

---

## 🎥 Video Tour of Code + Repo Structure

- [Click here to watch the full code explanation video](LINK_TO_YOUR_REPO_WALKTHROUGH_VIDEO)

The video includes:
- Full demo of the frontend working
- How the GitHub repo is structured (contracts, utils, components)
- How we satisfied point 7 (Polkadot EVM interaction via Viem and MetaMask)
- How the smart contract interacts with the frontend
- Explanation of any challenges faced and solved

---
