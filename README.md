# To run tests:

### Prerequisites
- Node.js v18.20.X installed 
> https://nodejs.org/en
- to check your node version, run:
> node --version

-------------------------------------

- npm v10.X.X installed  
  (Comes bundled with Node.js)
- to check your npm version, run:
> npm --version
-------------------------------------

- Java 17+ installed and `JAVA_HOME` configured (required for Allure)
- download Java here: 
> https://www.oracle.com/java/technologies/javase-downloads.html
- or here:
> https://adoptium.net/en-GB/temurin/releases/
- to check your Java version, run:
> java -version

-------------------------------------

- Allure CLI installed globally:
> npm install -g allure-commandline --save-dev

-------------------------------------

### Installation
1. Clone this project:
> https://github.com/n-t-i/new_project

2. Navigate to the project folder:
> cd my-wdio-framework

3. Install dependencies:
> npm install

-------------------------------------

## Usage
1. Run all tests locally:
> npm run wdio

2. Run a specific test file:
> npx wdio run ./wdio.conf.js --spec ./test/specs/{your_test_name_here}.js

3. Generate Allure report:
> npx allure generate allure-results --clean  

4. View allure report: 
> npx allure open

5. List available WebdriverIO CLI options:
> npx wdio --help

-------------------------------------

### Notes
- **JUnit** XML reports are saved in the `results/` directory (for CI integration).
- **Allure** raw results are saved in the `allure-results/` directory.
- Visual reports open in a browser once generated with Allure.

-------------------------------------
