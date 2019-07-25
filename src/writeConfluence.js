const { markdown } = require('markdown')
const Confluence = require('confluence-api')

const config = {
    username: process.env.CONFLUENCE_USER,
    password: process.env.CONFLUENCE_API_KEY,
    baseUrl:  "https://ecobee.atlassian.net/wiki"
}

const CONFLUENCE_QA_SPACE = "~538406635"
let CONFLUENCE_PARENT_ID = 898107893

const writeConfluence = async (releaseDetails, repositoryName, teamName) => {

    const confluence = new Confluence(config)

    const { body, version } = releaseDetails

    const html = markdown.toHTML(body)

    const today = new Date();
    const date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
    const title = `${date} - ${repositoryName} ${version}`
    
    // Find the Releases page for the current year
    confluence.getContentByPageTitle(CONFLUENCE_QA_SPACE, `${today.getFullYear()} Releases`, (err, response) => {
        if(response.size === 0) {
            
            // Create the page if it doesn't exist
            const childList = "<p><ac:structured-macro ac:name=\"children\" ac:schema-version=\"2\" ac:macro-id=\"14a02977-0f20-48cf-bba0-d2002db0e806\"><ac:parameter ac:name=\"all\">true</ac:parameter></ac:structured-macro></p>"
            confluence.postContent(CONFLUENCE_QA_SPACE, `${today.getFullYear()} Releases`, childList, null, (err, response) => {
                console.log(JSON.stringify(response))
                if(response.statusCode === 200) {
                    CONFLUENCE_PARENT_ID = response.results[0].id
                }
            });
        } else {
            CONFLUENCE_PARENT_ID = response.results[0].id
        }
    });

    console.log(CONFLUENCE_PARENT_ID)

    // create new page for current release
    // const response = await confluence.postContent(CONFLUENCE_QA_SPACE, title, html, CONFLUENCE_PARENT_ID);

    // return response
    return true
}

module.exports = writeConfluence