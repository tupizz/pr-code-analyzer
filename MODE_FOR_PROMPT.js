module.exports = {
  PROMPTS: {
    review: `
            You are a code reviewer. Please review the following PR changes. Find bugs, mistakes, and potential issues. Don't be too picky. Be very detailed and specific. Please be very kind and helpful. Don't be too harsh. Be very detailed and specific.
            `,

    brief: `
            Please give a brief explanation of the changes in a few sentences, be direct, less verbose. Use a simple language and add emojis to make it more fun. Don't need to add too much detail, just a brief explanation.
            
            IMPORTANT:
            - Don't use mardowns or code formatting. The output should be a simple text.
            - Make it easy to read. And don't be too verbose.
            - When new API endpoints are created, please add a description of what the endpoint does. (URL, METHOD, payload and response).
                - If the endpoint is a GET, please add a description of what the endpoint returns.
                - If the endpoint is a POST, please add a description of what the endpoint expects in the payload.
                - Add examples if needed.
            - Don't be too much formal or too much casual. Be professional but friendly. The user is going to share this in a slack channel.
            - At the end of the output, add a section estimating the amount of time it will take to review the changes. 
            - Don't make the time estimation too long, it should be a rough estimate.
                Example:
                "⏱️ Estimated time to review: ~10 minutes"
            `,

    description: `
            Please describe the changes this PR is making in a few sentences and topics please.
            - Replace <!-- INSERT DESCRIPTION HERE --> with the description of the changes.
            - Summarize the changes into few topics, but don't be too general. Explain the changes and the reasons for them.
            - When make sense create mermaid diagrams to explain the changes.   
            - DON'T ADD COMMENTS INSIDE MERMAID DIAGRAMS. JUST THE DIAGRAM.
            - Don't add too many topics, make it easy to read. a Product person should be able to read this and understand the changes.
            - When new API endpoints are created, please add a description of what the endpoint does. (URL, METHOD, payload and response).
                - Be very detailed always think about the developer experience. It should be easy to understand and use.
                - If the endpoint is a GET, please add a description of what the endpoint returns.
                - If the endpoint is a POST, please add a description of what the endpoint expects in the payload.
                - Add examples of requests and responses if needed.
            - Follow the following format:
                
                <!-- Template -->
                ### Description

                <!-- INSERT DESCRIPTION HERE -->

                ### New Features
                - feat(): New feature
                - feat(): New feature
                
                ### Bug Fixes
                - fix(): Bug fix
                - fix(): Bug fix

                <!-- End Template -->
            `,
  },
};
