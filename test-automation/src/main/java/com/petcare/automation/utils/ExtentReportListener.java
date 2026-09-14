package com.petcare.automation.utils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.markuputils.ExtentColor;
import com.aventstack.extentreports.markuputils.MarkupHelper;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import com.petcare.automation.base.DriverFactory;
import com.petcare.automation.config.FrameworkConstants;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

import java.io.File;

public class ExtentReportListener implements ITestListener {

    private static ExtentReports extent;
    private static final ThreadLocal<ExtentTest> testNode = new ThreadLocal<>();

    @Override
    public void onStart(ITestContext context) {
        File reportDir = new File(FrameworkConstants.REPORT_DIR);
        if (!reportDir.exists()) {
            reportDir.mkdirs();
        }

        ExtentSparkReporter sparkReporter = new ExtentSparkReporter(FrameworkConstants.REPORT_PATH);
        sparkReporter.config().setDocumentTitle("PetCare PRO - Báo Cáo Kiểm Thử Tự Động");
        sparkReporter.config().setReportName("Kết Quả Test Automation (Selenium + TestNG)");
        sparkReporter.config().setTheme(Theme.STANDARD);
        sparkReporter.config().setEncoding("UTF-8");
        sparkReporter.config().setTimeStampFormat("dd/MM/yyyy HH:mm:ss");

        extent = new ExtentReports();
        extent.attachReporter(sparkReporter);
        extent.setSystemInfo("Hệ Thống", "PetCare PRO Management System");
        extent.setSystemInfo("Môi Trường", "Local Testing (Vite Frontend)");
        extent.setSystemInfo("Framework", "Selenium 4.25 + TestNG 7.10");
        extent.setSystemInfo("Hệ Điều Hành", System.getProperty("os.name"));
        extent.setSystemInfo("Java Version", System.getProperty("java.version"));
    }

    @Override
    public void onTestStart(ITestResult result) {
        String testName = result.getMethod().getMethodName();
        String description = result.getMethod().getDescription();
        if (description == null || description.isEmpty()) {
            description = testName;
        }

        ExtentTest test = extent.createTest(testName, description);
        test.assignCategory(result.getTestClass().getRealClass().getSimpleName());
        testNode.set(test);
        testNode.get().log(Status.INFO, "▶ Bắt đầu thực thi: <b>" + testName + "</b>");
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        testNode.get().log(Status.PASS, MarkupHelper.createLabel("✔ TEST PASSED (THÀNH CÔNG)", ExtentColor.GREEN));
    }

    @Override
    public void onTestFailure(ITestResult result) {
        testNode.get().log(Status.FAIL, MarkupHelper.createLabel("✘ TEST FAILED (THẤT BẠI)", ExtentColor.RED));
        testNode.get().log(Status.FAIL, "Chi tiết lỗi: " + result.getThrowable());

        try {
            String base64Screenshot = ScreenshotUtils.captureScreenshotAsBase64(DriverFactory.getDriver());
            if (!base64Screenshot.isEmpty()) {
                testNode.get().addScreenCaptureFromBase64String(base64Screenshot, "Ảnh chụp lỗi màn hình");
            }
        } catch (Exception e) {
            testNode.get().log(Status.WARNING, "Không thể đính kèm ảnh chụp màn hình: " + e.getMessage());
        }
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        testNode.get().log(Status.SKIP, MarkupHelper.createLabel("↷ TEST SKIPPED (BỎ QUA)", ExtentColor.ORANGE));
        if (result.getThrowable() != null) {
            testNode.get().log(Status.SKIP, "Lý do: " + result.getThrowable().getMessage());
        }
    }

    @Override
    public void onFinish(ITestContext context) {
        if (extent != null) {
            extent.flush();
        }
    }

    public static ExtentTest getTest() {
        return testNode.get();
    }

    public static void logStep(String message) {
        if (testNode.get() != null) {
            testNode.get().log(Status.INFO, message);
        }
    }
}
