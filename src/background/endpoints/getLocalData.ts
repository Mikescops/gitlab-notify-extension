import * as browser from 'webextension-polyfill';

export const getLocalData = async (global_error: Error | null) => {
    if (global_error) {
        return Promise.resolve({ error: global_error.message });
    }

    return await browser.storage.local.get([
        'mrReceived',
        'mrGiven',
        'mrToReview',
        'mrReviewed',
        'issuesAssigned',
        'todos',
        'lastUpdateDateUnix'
    ]);
};
