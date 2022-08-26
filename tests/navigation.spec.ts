import { test, expect, Locator, Page } from '@playwright/test';
import * as navData from './data/nav-data.json';

// Interface for nav items being loaded from json
interface NavItem {
    title: string,
    relativeURL: string,
    parent: string,
    expectedElement: string,
    expectedText: string
}

test.describe('Successfully navigates to', async() => {
    let navItems: NavItem[] = navData.navItems;
    let navContainer: Locator = null;
    let navButton: Locator = null;
    let expectedElement: Locator = null;

    test.beforeEach(async ({page}) => {
        navButton = null;
        expectedElement = null;
        await page.goto("/");
        // Following var is not to my liking, but the mobile nav menu was actually loaded in the DOM,
        // which caused issues with strict matching.
        navContainer = page.locator('div.desktop');
    });

    navItems.forEach((navItem) => {
        // 1. Navigate to page
        // 2. Wait for networkidle
        // 3. Ensure URL is correct and that some element is visible on page
        test(`${navItem.title} page`, async({page}) => {
            // If parent is present, hover over parent to open sub-nav
            if (navItem.parent) {
                await navContainer.locator('a[href^="#"]', { hasText: navItem.parent }).hover();
            }
            navButton = navContainer.locator('a', { hasText: navItem.title });
            await navButton.click();
            await page.waitForLoadState('networkidle');
            await expect(page).toHaveURL(navItem.relativeURL);
            expectedElement = page.locator(navItem.expectedElement, { hasText: navItem.expectedText });
            await expect(expectedElement).toBeVisible();
        })
    })
});
