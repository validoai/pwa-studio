import {
    hoverCategoryFromMegaMenu,
    selectCategoryFromMegaMenu
} from '../../../actions/categoryPage';
import { toggleHeaderNav } from '../../../actions/header';
import {
    assertNumberOfProductsListed,
    assertProductsFound
} from '../../../assertions/categoryPage';
import {
    assertCategoryInCategoryTree,
    assertNumberOfCategoriesInCategoryTree
} from '../../../assertions/categoryTree';
import {
    assertCategoryInMegaMenu,
    assertNumberOfCategoriesInMegaMenu
} from '../../../assertions/megaMenu';
import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
import { getCategoriesCall } from '../../../fixtures/graphqlMockedCalls';
const {
    getStoreConfigDataCall,
    getStoreNameCall,
    getAvailableStoresDataCall,
    getStoreConfigForMegaMenuCall,
    getMegaMenuCall,
    getStoreConfigForContactUsCall,
    getStoreConfigForNewsletterCall,
    storeConfigDataCall,
    getNavigationMenuCall,
    getLocaleCall,
    getRootCategoryIdCall,
    getStoreConfigForMiniCartCall,
    getStoreConfigForCategoryTreeCall
} = graphqlMockedCallsFixtures;

const DATA_DIRECTORY = 'multiStore/data';

const getFixtureLocationPrefix = req => {
    const {
        headers: { store }
    } = req;
    switch (store) {
        default:
            return `${DATA_DIRECTORY}/default`;
    }
};

const getInterceptHandler = filename => {
    const handler = req => {
        req.reply({
            fixture: `${getFixtureLocationPrefix(req)}/${filename}.json`
        });
    };

    return handler;
};

describe('PWA-1408: Verify data displayed is from Default Root Category', () => {
    beforeEach(() => {
        cy.intercept('GET', getAvailableStoresDataCall, req => {
            req.reply({
                fixture: `${DATA_DIRECTORY}/availableStores.json`
            });
        }).as('getMockAvailableStores');

        cy.intercept(
            'GET',
            getMegaMenuCall,
            getInterceptHandler('megaMenu')
        ).as('getMockMegaMenu');

        cy.intercept(
            'GET',
            getRootCategoryIdCall,
            getInterceptHandler('rootCategoryId')
        ).as('getMockRootCategoryId');

        cy.intercept(
            'GET',
            getNavigationMenuCall,
            getInterceptHandler('navigationMenu')
        ).as('getMockNavigationMenu');

        // Intercept calls for the store config
        cy.intercept(
            'GET',
            getStoreConfigDataCall,
            getInterceptHandler('storeConfig')
        ).as('getMockStoreConfig');

        cy.intercept(
            'GET',
            getStoreConfigForMegaMenuCall,
            getInterceptHandler('storeConfig')
        ).as('getMockStoreConfigForMegaMenu');

        cy.intercept(
            'GET',
            getStoreConfigForContactUsCall,
            getInterceptHandler('storeConfig')
        ).as('getMockStoreConfigForContactUs');

        cy.intercept(
            'GET',
            getStoreConfigForNewsletterCall,
            getInterceptHandler('storeConfig')
        ).as('getMockStoreConfigForNewsletter');

        cy.intercept(
            'GET',
            storeConfigDataCall,
            getInterceptHandler('storeConfig')
        ).as('mockStoreConfig');

        cy.intercept(
            'GET',
            getStoreConfigForCategoryTreeCall,
            getInterceptHandler('storeConfig')
        ).as('getMockStoreConfigForCategoryTree');

        cy.intercept(
            'GET',
            getLocaleCall,
            getInterceptHandler('storeConfig')
        ).as('getMockLocale');

        cy.intercept(
            'GET',
            getStoreConfigForMiniCartCall,
            getInterceptHandler('storeConfig')
        ).as('getMockStoreConfigForMiniCart');

        cy.intercept(
            'GET',
            getStoreNameCall,
            getInterceptHandler('storeConfig')
        ).as('getMockStoreName');
    });

    it('displays subcategories from the default root category', () => {
        cy.visitPage('/');

        cy.wait([
            '@getMockAvailableStores',
            '@getMockMegaMenu',
            '@getMockRootCategoryId',
            '@getMockNavigationMenu',
            '@getMockStoreConfig',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForContactUs',
            '@getMockStoreConfigForNewsletter',
            '@mockStoreConfig',
            '@getMockStoreConfigForCategoryTree',
            '@getMockLocale',
            '@getMockStoreConfigForMiniCart',
            '@getMockStoreName'
        ]);

        // There are only 4 categories for the default store in the mock data
        assertNumberOfCategoriesInMegaMenu(4);
        assertNumberOfCategoriesInCategoryTree(4);

        // Verify default categories are listed in the MegaMenu component
        assertCategoryInMegaMenu('Tops');
        assertCategoryInMegaMenu('Bottoms');
        assertCategoryInMegaMenu('Dresses');
        assertCategoryInMegaMenu('Accessories');

        //Verify default categories are listed in the CategoryTree navigation
        assertCategoryInCategoryTree('Tops');
        assertCategoryInCategoryTree('Bottoms');
        assertCategoryInCategoryTree('Dresses');
        assertCategoryInCategoryTree('Accessories');
    });

    it('displays products from the default store', () => {
        cy.visitPage('/');

        cy.wait([
            '@getMockAvailableStores',
            '@getMockMegaMenu',
            '@getMockRootCategoryId',
            '@getMockNavigationMenu',
            '@getMockStoreConfig',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForContactUs',
            '@getMockStoreConfigForNewsletter',
            '@mockStoreConfig',
            '@getMockStoreConfigForCategoryTree',
            '@getMockLocale',
            '@getMockStoreConfigForMiniCart',
            '@getMockStoreName'
        ]);

        selectCategoryFromMegaMenu('Accessories');

        cy.intercept(
            getCategoriesCall,
            getInterceptHandler('accessoriesCategory')
        ).as('getMockAccessoriesCategory');

        cy.wait('@getMockAccessoriesCategory');

        assertProductsFound();

        // There are only 3 accessories for the default store in the mock data
        assertNumberOfProductsListed(3);
    });
});
