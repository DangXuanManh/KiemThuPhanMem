package com.petcare.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import java.util.List;

public class PosOrdersPage extends BasePage {

    private final By pageTitle = By.xpath("//h1[contains(., 'Đơn Hàng')]");
    private final By openPosBtn = By.xpath("//button[contains(., 'Bán Hàng Mới (POS)') or contains(., 'Bán Hàng')]");
    private final By orderRows = By.xpath("//table//tbody/tr");
    private final By viewInvoiceBtns = By.xpath("//button[contains(., 'Xem Hóa Đơn') or contains(., 'Hóa Đơn')]");

    // POS Drawer Form
    private final By addProductSelect = By.xpath("//select[option[contains(text(), 'Chọn sản phẩm')]]");
    private final By addServiceSelect = By.xpath("//select[option[contains(text(), 'Chọn dịch vụ')]]");
    private final By checkoutSubmitBtn = By.xpath("//form//button[@type='submit']");

    // Invoice Drawer
    private final By invoiceBox = By.xpath("//div[@id='printableInvoice'] | //div[contains(., 'PETCARE PRO STORE')]");

    public PosOrdersPage(WebDriver driver) {
        super(driver);
    }

    public boolean isPageDisplayed() {
        return isElementDisplayed(pageTitle);
    }

    public void openPosModal() {
        click(openPosBtn);
        sleep(500);
    }

    public void addFirstProductToCart() {
        if (isElementPresent(addProductSelect)) {
            WebElement selectElem = driver.findElement(addProductSelect);
            Select select = new Select(selectElem);
            if (select.getOptions().size() > 1) {
                select.selectByIndex(1);
                sleep(300);
            }
        }
    }

    public void addFirstServiceToCart() {
        if (isElementPresent(addServiceSelect)) {
            WebElement selectElem = driver.findElement(addServiceSelect);
            Select select = new Select(selectElem);
            if (select.getOptions().size() > 1) {
                select.selectByIndex(1);
                sleep(300);
            }
        }
    }

    public void completeCheckout() {
        click(checkoutSubmitBtn);
        sleep(800);
    }

    public void viewFirstOrderInvoice() {
        List<WebElement> buttons = findElements(viewInvoiceBtns);
        if (!buttons.isEmpty()) {
            buttons.get(0).click();
            sleep(500);
        }
    }

    public boolean isInvoiceDisplayed() {
        return isElementDisplayed(invoiceBox);
    }

    public int getOrdersCount() {
        return findElements(orderRows).size();
    }
}
