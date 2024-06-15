import * as browser from 'webextension-polyfill';
import { TabId } from '../common/types';
import { config } from '../config/config';

export const updateConfiguration = async (objectToStore: Record<string, any>): Promise<void> => {
    await browser.storage.local.set(objectToStore);
    console.log('Configuration Updated');
};

export const readConfiguration = async <T>(keys: string[]): Promise<T> => {
    return browser.storage.local.get(keys).then((settings) => {
        if (typeof settings.defaultTab === 'number') {
            const legacyMapping: { [key: number]: TabId } = {
                0: 'to_review',
                1: 'under_review',
                2: 'issues',
                3: 'todo_list'
            };
            settings.defaultTab = legacyMapping[settings.defaultTab] ?? 'to_review';
        }

        if (typeof settings.accounts === 'string') {
            const accounts = JSON.parse(settings.accounts);

            settings.accounts =
                accounts?.map((account: any) => ({
                    token: account.token,
                    address: account.address,
                    gitlabCE: Boolean(account.gitlabCE),
                    draftInToReviewTab: Boolean(account.draftInToReviewTab),
                    projectDirectoryPrefix: account.projectDirectoryPrefix
                })) ?? [];
        }

        for (const setting of keys) {
            if (settings[setting] === undefined) {
                settings[setting] = (config as Record<string, any>)[setting] ?? undefined;
            }
        }

        return settings as T;
    });
};
