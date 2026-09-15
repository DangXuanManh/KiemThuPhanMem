package com.petcare.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class PosOrdersPage extends BasePage {

    private final By pageTitle = By.xpath("//h1[contains(., 'Đơn Hàng')]");
    private final By openPosBtn = By.xpath("//button[contains(., 'Bán Hàng Mới (POS)') or contains(., 'Bán Hàng')]");
    private final By orderRows = By.xpath("//table//tbody/tr");
    private final By viewInvoiceBtns = By.xpath("//table//tbody//button[contains(., 'Xem Hóa Đơn') or contains(., 'Hóa Đơn')]");

    // POS Catalog Controls
    private final By productTabBtn = By.xpath("//button[contains(., 'Sản Phẩm')]");
    private final By serviceTabBtn = By.xpath("//button[contains(., 'Dịch Vụ')]");
    private final By addCatalogItemBtns = By.xpath("//button[contains(., 'Thêm')]");
    private final By checkoutSubmitBtn = By.xpath("//button[@type='submit' and (contains(., 'Thanh Toán') or contains(., 'Hoàn Tất'))] | //form//button[@type='submit']");
    private final By posModalDialog = By.xpath("//div[contains(@class, 'fixed inset-0')]");

    // Legacy Fallbacks
    private final By legacyAddProductSelect = By.xpath("//select[option[contains(text(), 'Chọn sản phẩm')]]");
    private final By legacyAddServiceSelect = By.xpath("//select[option[contains(text(), 'Chọn dịch vụ')]]");

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
        sleep(600);
    }

    public void addFirstProductToCart() {
        if (isElementPresent(productTabBtn)) {
            click(productTabBtn);
            sleep(300);
        }
        
        List<WebElement> addBtns = findElements(addCatalogItemBtns);
        if (!addBtns.isEmpty()) {
            try {
                addBtns.get(0).click();
            } catch (Exception e) {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", addBtns.get(0));
            }
            sleep(400);
            return;
        }

        // Fallback for legacy select
        if (isElementPresent(legacyAddProductSelect)) {
            WebElement selectElem = driver.findElement(legacyAddProductSelect);
            Select select = new Select(selectElem);
            if (select.getOptions().size() > 1) {
                select.selectByIndex(1);
                sleep(300);
            }
        }
    }

    public void addFirstServiceToCart() {
        if (isElementPresent(serviceTabBtn)) {
            click(serviceTabBtn);
            sleep(400);
            List<WebElement> addBtns = findElements(addCatalogItemBtns);
            if (!addBtns.isEmpty()) {
                try {
                    addBtns.get(0).click();
                } catch (Exception e) {
                    ((JavascriptExecutor) driver).executeScript("arguments[0].click();", addBtns.get(0));
                }
                sleep(400);
                return;
            }
        }

        // Fallback for legacy select
        if (isElementPresent(legacyAddServiceSelect)) {
            WebElement selectElem = driver.findElement(legacyAddServiceSelect);
            Select select = new Select(selectElem);
            if (select.getOptions().size() > 1) {
                select.selectByIndex(1);
                sleep(300);
            }
        }
    }

    public void completeCheckout() {
        click(checkoutSubmitBtn);
        sleep(1000);

        // Wait until POS modal is dismissed
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(3));
            wait.until(ExpectedConditions.invisibilityOfElementLocated(posModalDialog));
        } catch (Exception ignored) {
            sleep(500);
        }
    }

    public void viewFirstOrderInvoice() {
        sleep(800);
        List<WebElement> buttons = findElements(viewInvoiceBtns);
        if (!buttons.isEmpty()) {
            try {
                buttons.get(0).click();
            } catch (Exception e) {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", buttons.get(0));
            }
            sleep(600);
        }
    }

    public boolean isInvoiceDisplayed() {
        return isElementDisplayed(invoiceBox);
    }

    public int getOrdersCount() {
        return findElements(orderRows).size();
    }
}
