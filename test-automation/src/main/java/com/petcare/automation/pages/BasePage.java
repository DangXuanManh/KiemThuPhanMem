package com.petcare.automation.pages;

import com.petcare.automation.utils.WaitUtils;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.Select;

import java.util.List;

public abstract class BasePage {

    protected WebDriver driver;
    protected Actions actions;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.actions = new Actions(driver);
    }

    protected void click(By locator) {
        try {
            WebElement element = WaitUtils.waitForClickable(driver, locator);
            scrollToElement(element);
            element.click();
        } catch (Exception e) {
            // Fallback sang Javascript click nếu bị header che khuất hoặc animation
            jsClick(locator);
        }
    }

    protected void jsClick(By locator) {
        WebElement element = WaitUtils.waitForPresence(driver, locator);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    protected void sendKeys(By locator, String text) {
        WebElement element = WaitUtils.waitForVisibility(driver, locator);
        element.clear();
        element.sendKeys(text);
    }

    protected String getText(By locator) {
        WebElement element = WaitUtils.waitForVisibility(driver, locator);
        return element.getText().trim();
    }

    protected boolean isElementDisplayed(By locator) {
        try {
            return WaitUtils.waitForVisibility(driver, locator).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    protected boolean isElementPresent(By locator) {
        try {
            return driver.findElements(locator).size() > 0;
        } catch (Exception e) {
            return false;
        }
    }

    protected void selectByVisibleText(By locator, String text) {
        WebElement element = WaitUtils.waitForVisibility(driver, locator);
        Select select = new Select(element);
        select.selectByVisibleText(text);
    }

    protected void selectByValue(By locator, String value) {
        WebElement element = WaitUtils.waitForVisibility(driver, locator);
        Select select = new Select(element);
        select.selectByValue(value);
    }

    protected void scrollToElement(WebElement element) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
    }

    protected List<WebElement> findElements(By locator) {
        return driver.findElements(locator);
    }

    protected void sleep(long millis) {
        WaitUtils.sleep(millis);
    }
}
