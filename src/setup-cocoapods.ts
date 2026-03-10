import * as core from "@actions/core";
import { CocoapodsInstaller } from "./installer";
import { getVersionFromPodfile } from "./podfile-parser";
import * as github from "@actions/github";
import axios, {isAxiosError} from "axios";

async function validateSubscription() {
    const repoPrivate = github.context?.payload?.repository?.private;
    const upstream = "maxim-lobanov/setup-cocoapods";
    const action = process.env.GITHUB_ACTION_REPOSITORY;
    const docsUrl = "https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions";

    core.info("");
    core.info("\u001b[1;36mStepSecurity Maintained Action\u001b[0m");
    core.info(`Secure drop-in replacement for ${upstream}`);
    if (repoPrivate === false) core.info("\u001b[32m\u2713 Free for public repositories\u001b[0m");
    core.info(`\u001b[36mLearn more:\u001b[0m ${docsUrl}`);
    core.info("");

    if (repoPrivate === false) return;

    const serverUrl = process.env.GITHUB_SERVER_URL || "https://github.com";
    const body: Record<string, string> = { action: action || "" };
    if (serverUrl !== "https://github.com") body.ghes_server = serverUrl;
    try {
        await axios.post(
            `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/maintained-actions-subscription`,
            body, { timeout: 3000 }
        );
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 403) {
            core.error("\u001b[1;31mThis action requires a StepSecurity subscription for private repositories.\u001b[0m");
            core.error(`\u001b[31mLearn how to enable a subscription: ${docsUrl}\u001b[0m`);
            process.exit(1);
        }
        core.info("Timeout or API not reachable. Continuing to next step.");
    }
}

const run = async (): Promise<void> => {
    try {
        await validateSubscription();

        if (process.platform !== "darwin" && process.platform !== "linux") {
            throw new Error(`This task is intended for macOS and linux platforms. It can't be run on '${process.platform}' platform`);
        }

        let versionSpec = core.getInput("version", { required: false });
        const podfilePath = core.getInput("podfile-path", { required: false });

        if (!!versionSpec === !!podfilePath) {
            throw new Error("Invalid input parameters usage. Either 'version' or 'podfile-path' should be specified. Not the both ones.");
        }

        if (!versionSpec) {
            core.debug("Reading Podfile to determine the version of Cocoapods...");
            versionSpec = getVersionFromPodfile(podfilePath);
            core.info(`Podfile points to the Cocoapods ${versionSpec}`);
        }

        await CocoapodsInstaller.install(versionSpec);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
};

run();
