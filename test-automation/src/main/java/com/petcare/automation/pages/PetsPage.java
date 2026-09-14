package com.petcare.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class PetsPage extends BasePage {

    private final By pageTitle = By.xpath("//h1[contains(., 'Thú Cưng')]");
    private final By speciesSelect = By.xpath("//select[option[contains(text(), 'Tất cả loài')]]");
    private final By gridViewBtn = By.xpath("//button[@title='Xem Dạng Thẻ']");
    private final By tableViewBtn = By.xpath("//button[@title='Xem Dạng Bảng']");
    private final By petCards = By.xpath("//div[contains(@class, 'rounded-3xl') and contains(., 'kg')]");

    public PetsPage(WebDriver driver) {
        super(driver);
    }

    public boolean isPageDisplayed() {
        return isElementDisplayed(pageTitle);
    }

    public void filterBySpecies(String species) {
        selectByVisibleText(speciesSelect, species);
        sleep(400);
    }

    public void switchToTableView() {
        click(tableViewBtn);
        sleep(300);
    }

    public void switchToGridView() {
        click(gridViewBtn);
        sleep(300);
    }

    public int getPetCardsCount() {
        return findElements(petCards).size();
    }
}
