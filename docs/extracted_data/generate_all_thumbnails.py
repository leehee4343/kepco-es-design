import asyncio
from playwright.async_api import async_playwright
import os

SCREENS = [
    ("Dashboard.html", "assets/thumbnails/thumb_dashboard.png"),
    ("ProjectRegister.html", "assets/thumbnails/thumb_register.png"),
    ("SRMLogin.html", "assets/thumbnails/thumb_srm_login.png"),
    ("ProjectSearch.html", "assets/thumbnails/thumb_search.png"),
    ("ProjectDetail.html", "assets/thumbnails/thumb_detail.png"),
    ("BusinessSettlement.html", "assets/thumbnails/thumb_settlement.png"),
    ("Statistics.html", "assets/thumbnails/thumb_statistics.png"),
    ("StepWorkflow.html", "assets/thumbnails/thumb_workflow.png"),
    ("PlanPerformance.html", "assets/thumbnails/thumb_plan_perf.png"),
    ("SRMDashboard.html", "assets/thumbnails/thumb_srm_dash.png"),
    ("PartnerRegister.html", "assets/thumbnails/thumb_partner_reg.png"),
    ("SRMDetail.html", "assets/thumbnails/thumb_srm_detail.png"),
]

async def main():
    base_dir = os.path.abspath(".")
    os.makedirs("assets/thumbnails", exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1440, 'height': 810},
            device_scale_factor=1.0
        )
        page = await context.new_page()
        
        for html_file, thumb_file in SCREENS:
            full_path = os.path.join(base_dir, html_file)
            print(f"Capturing {html_file} -> {thumb_file}...")
            await page.goto(f"file:///{full_path}")
            await page.wait_for_timeout(800)
            
            # Hide footers and ensure clean initial state
            await page.evaluate("""() => {
                const footer = document.querySelector('.app-footer');
                if (footer) footer.style.display = 'none';
                
                // Hide any unprompted modal overlays
                document.querySelectorAll('.modal-backdrop, .modal-overlay').forEach(el => {
                    if (!el.classList.contains('show')) el.style.display = 'none';
                });
            }""")
            await page.wait_for_timeout(200)
            
            # Capture exact 1440x810 viewport
            await page.screenshot(
                path=thumb_file,
                clip={'x': 0, 'y': 0, 'width': 1440, 'height': 810}
            )
            print(f"  Done: {thumb_file}")
            
        # Also capture index.html to verify new gradient buttons
        print("Capturing index.html with new gradient buttons...")
        await page.goto(f"file:///{os.path.join(base_dir, 'index.html')}")
        await page.wait_for_timeout(1000)
        await page.screenshot(
            path="verify_index_gradient.png",
            clip={'x': 0, 'y': 0, 'width': 1440, 'height': 900}
        )
        print("All thumbnails captured successfully!")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
