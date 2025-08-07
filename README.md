This project is an automation and a website that monitor the status of ships on the Marine Traffic website. I created an interface using HTML and CSS, and used JavaScript as both the front-end and back-end language. MongoDB was used to store the users information.

The user can either log in or sign up. After registration, the user can select all the ships needed for the automation — this selection is done through a CRUD system. Once all necessary ships are selected, the user can start the automation.

For the automation, I used PuppetJS. The automation accesses Marine Traffic, clicks on a spam pop-up if it exists, uses the search bar to find the current ship, and performs web scraping to collect the ship’s information. Then, it updates the database with the latest ship data. This process is repeated for all ships in the user’s list.

After the scraping is completed, the automation generates an Excel file with the collected data.
