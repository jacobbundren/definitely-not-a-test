import { test, expect, Locator, Page } from '@playwright/test';

// Would have liked more here, but it was my first stab at Playwright and I didn't want to spend much
// more than the time that Jon expected.
test.describe('Atreos Team Tests', async() => {

    test.beforeEach(async ({page}) => {
        await page.goto("/atreos-team/");
        await page.waitForLoadState('networkidle');
    });

    test('Correct number of cards exist', async({page}) => {
        const numberCards: number = await page.locator('div.team-card').count();
        await expect(numberCards).toEqual(12)
    });

    test('Clicking Core Team member navigates to internal page', async({page}) => {
        await page.locator('div.team-detail', { hasText: 'Chief Executive Officer' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('atreos-team/ryan-harrison/');
    });

    test('Clicking Advisory Team member navigates to external page', async({page}) => {
        const [externalLink] = await Promise.all([
            page.waitForEvent('popup'),
            page.locator('div.team-detail', { hasText: 'Jonathan Dole' }).click(),
        ])
        await externalLink.waitForLoadState();
        await expect(externalLink).toHaveURL(new RegExp(/linkedin.com/));
    });
});
