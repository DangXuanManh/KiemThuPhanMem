package com.petcare.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class PromotionsPage extends BasePage {

    private final By pageTitle = By.xpath("//h1[contains(., 'Khuyến Mãi') or contains(., 'Mã Giảm Giá')]");
    private final By addPromoBtn = By.xpath("//button[contains(., 'Tạo Mã Ưu Đãi Mới') or contains(., 'Tạo Mã')]");
    private final By promoCards = By.xpath("//div[contains(@class, 'rounded-3xl') and contains(., 'Mức giảm giá')]");
    private final By copyButtons = By.xpath("//button[contains(., 'Copy Code') or contains(., 'Đã copy')]");

    // Modal
    private final By codeInput = By.xpath("//input[@placeholder[contains(., 'KHAMPHA')]]");
    private final By nameInput = By.xpath("//input[@placeholder[contains(., 'Tri ân')]]");
    private final By submitBtn = By.xpath("//form//button[@type='submit']");

    public PromotionsPage(WebDriver driver) {
        super(driver);
    }

    public boolean isPageDisplayed() {
        return isElementDisplayed(pageTitle);
    }

    public void createNewVoucher(String code, String name) {
        click(addPromoBtn);
        sleep(500);
        sendKeys(codeInput, code);
        sendKeys(nameInput, name);
        click(submitBtn);
        sleep(600);
    }

    public void clickCopyFirstVoucher() {
        if (isElementPresent(copyButtons)) {
            click(copyButtons);
            sleep(300);
        }
    }

    public int getVoucherCount() {
        return findElements(promoCards).size();
    }
}
