import Handler from "./interfaces/HandlerInterface";

class SendCampaignStatus implements Handler {
    // readonly siteId: string;
    // readonly campaignId: string;
    // readonly emailId: string;

    constructor(readonly siteId: string, readonly campaignId: string, readonly emailId: string) {
        this.siteId = siteId;
        this.campaignId = campaignId;
        this.emailId = emailId;
    }
    
    async handle(): Promise<void> {
        // Simulate sending campaign status
        console.log('\nThe campaign data for siteId:', this.siteId, 'campaignId:', this.campaignId, 'emailId:', this.emailId, '\n');
    }

}

export default SendCampaignStatus;