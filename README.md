# HUB_EasyA_Hack
![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](https://Screenshot_52.png)

## Smart Contract Functionality: 
 The smart contract is written in solidity and deployed via the Remix IDE.\
 The smart contract has two main functionalities: **To view the baggage information, and then to update the baggage information**\
 (With more time, functionality would be added that ensures checks that ONLY verified baggage handlers can update baggage information)
 
 Here we have the functions: ``` storeBaggage , updateLocation, getBaggage ,completeBaggage```.  ```storeBaggage``` provides a way to create a new Baggage instance by assigning a BaggageID and initial airport location to a new instance of the "Baggage" structure; ```updateLocation``` a method to update the airport location and Location status (e.g. check-in,on plane, transfer, arrival), ```getBaggage``` a method to look at the location and location status given a baggage id (Baggage ID's will be generated with secure methods in later versions- currently accept any abitrary string), lastly ```completeBaggage``` was a later functionality such that upon baggage arrival to the final airport, the Baggage structure would have the ```completed``` bool become true, signifiying that specific baggage had been collected. 

 ## 

JFK , transfer, 123

BOS, check-in, 456


View to a transaction completed via our smart contract:
https://assethub-westend.subscan.io/tx/0xd01a37d04dbb6ab1fcff45df30b9e2b5117d167bce4a40d0b62dd3baea863f20?ref=hackernoon.com