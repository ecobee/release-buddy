const { markdown } = require('markdown')
const Confluence = require('confluence-api')

const config = {
    username: process.env.CONFLUENCE_USER,
    password: process.env.CONFLUENCE_API_KEY,
    baseUrl:  "https://ecobee.atlassian.net/wiki"
}
const confluence = new Confluence(config)

const CONFLUENCE_QA_SPACE = "QA"

const createConfluencePageForRelease = (space, title, html, parentId) => {
    confluence.postContent(space, title, html, parentId, (err, response) => {
        if(err) {
            throw new Error(response.text)
        } 
        return response
    });
}

const writeConfluence = async (log, releaseDetails, repositoryName, teamName) => {

    const { name, body, version } = releaseDetails

    const includeTeamName = teamName ? `<p><strong>Team: ${teamName}<br /></strong></p>` : ''
    const includeReleaseName = name ? `<p><strong>Release Name: ${name}<br /></strong></p>` : ''
    const html = `${includeTeamName} ${includeReleaseName} <p><strong>Notes:<br /></strong></p> ${markdown.toHTML(body)}`

    const today = new Date();
    const month = `0${today.getMonth()+1}`.slice(-2)
    const date = `${today.getFullYear()}-${month}-${today.getDate()}`
    const title = `${date} - ${repositoryName} ${version}`
    
    // Find the Releases page for the current year
    confluence.getContentByPageTitle(CONFLUENCE_QA_SPACE, `${today.getFullYear()} Releases`, (err, response) => {
        if(response.size === 0) {
            
            // Create the page if it doesn't exist
            const childList = `<p><ac:structured-macro ac:name="children" ac:schema-version="2" ac:macro-id="14a02977-0f20-48cf-bba0-d2002db0e806"><ac:parameter ac:name="all">true</ac:parameter></ac:structured-macro></p>`
            confluence.postContent(CONFLUENCE_QA_SPACE, `${today.getFullYear()} Releases`, childList, null, (err, response) => {
                if(err) {
                    log(`An error has occurred: ${err}`)
                    throw new Error(response.text)
                } 

                log("Created yearly release page, time to create project release page")
                return createConfluencePageForRelease(CONFLUENCE_QA_SPACE, title, html, response.results[0].id)
                
            });
        } else {
            log("Time to create project release page")
            return createConfluencePageForRelease(CONFLUENCE_QA_SPACE, title, html, response.results[0].id)
        }
    });
}

module.exports = writeConfluence