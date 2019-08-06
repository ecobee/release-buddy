const { markdown } = require('markdown')
const Confluence = require('confluence-api')

const writeConfluence = async (settings, releaseDetails, repositoryName, teamName) => {

    let confluence = null

    if (
        process.env.CONFLUENCE_USER &&
        process.env.CONFLUENCE_API_KEY &&
        process.env.CONFLUENCE_BASE_URL
    ) {
        const config = {
            username: process.env.CONFLUENCE_USER,
            password: process.env.CONFLUENCE_API_KEY,
            baseUrl: process.env.CONFLUENCE_BASE_URL,
        }
        confluence = new Confluence(config)
    } else {
        throw new Error("Missing Confluence environment variables.")
    }

    const { space, parentId } = settings
    const { name, body, version } = releaseDetails

    const includeTeamName = teamName ? `<p><strong>Team: ${teamName}<br /></strong></p>` : ''
    const includeReleaseName = name ? `<p><strong>Release Name: ${name}<br /></strong></p>` : ''
    const html = `${includeTeamName} ${includeReleaseName} <p><strong>Notes:<br /></strong></p> ${markdown.toHTML(body)}`

    const today = new Date();
    const month = `0${today.getMonth()+1}`.slice(-2)
    const date = `${today.getFullYear()}-${month}-${today.getDate()}`
    const title = `${date} - ${repositoryName} ${version}`

    // Create a wiki page for the current release as a child to the specified parent in the specified space in the config
    confluence.postContent(space, title, html, parentId, (err, response) => {
        if(err) {
            throw new Error(response.text)
        } 
        return response
    });
}

module.exports = writeConfluence