"""
Gig 1: Website Clone & Redesign
使用 CloakBrowser 在 Fiverr 上全自动创建 Gig 1
"""
import os
import time
import sys
import traceback

os.environ['CLOAKBROWSER_BINARY_PATH'] = 'C:/Users/Administrator/cloakbrowser/chrome.exe'

from cloakbrowser import launch_context

SCREENSHOT_DIR = 'C:/Users/Administrator/Desktop/Gooodsky'
GIG1_COVER = 'C:/Users/Administrator/ToolClub/projects/fiverr/gigs/gig1-clone/images/cover.png'

GIG_TITLE = "I will clone and redesign any website into modern Next.js + Tailwind CSS code"
TAGS = ["website clone", "next js developer", "tailwind css", "website redesign", "react frontend"]

DESCRIPTION = """Turn any website into a modern, production-ready Next.js application — delivered 2-3x faster through AI-assisted development.

Have you found a website you love but need it rebuilt with modern tech? Or perhaps your existing site is stuck on outdated code and needs a full-stack redesign? I reverse engineer any website and deliver clean, pixel-perfect Next.js + Tailwind CSS code — fully responsive, SEO-optimized, and ready to deploy.

What makes this different: I combine deep frontend expertise with a custom AI-assisted workflow that accelerates the cloning and redesign process by 2-3x. This means you get the same (or better) quality as traditional developers, but in a fraction of the time. Every project includes clean TypeScript code, responsive design across all devices, and SEO best practices baked in from day one.

My process is simple: (1) You share the target website and your requirements, (2) I analyze the structure and extract the design system, (3) I rebuild it with Next.js 15+, Tailwind CSS 4, and TypeScript, (4) You review and request revisions until you are completely satisfied. The final deliverable includes full source code, deployment instructions, and optional Vercel deployment.

Whether you are an entrepreneur validating an idea, a small business upgrading your online presence, or a designer who needs a developer to bring your vision to life — I deliver production-grade code, not prototypes. Let's build something great."""

FAQ_TEXT = """## FAQ

**1. What exactly do you mean by "clone" a website? Is this legal?**
I reverse engineer the visual design, layout, and UX patterns of a website — not the backend, proprietary data, or copyrighted assets. Think of it as a "design reference rebuild." I use entirely original code and replace all images, logos, and text with your content. This is 100% legal and is a standard industry practice. If you want an exact copy of a competitor's site, I will not take the project.

**2. Can you clone complex websites with login systems, dashboards, and databases?**
Yes — the Premium package covers sites with authentication, user dashboards, database integration, and API connections. For highly complex applications beyond 10 pages, please message me for a custom quote before ordering.

**3. What do you need from me to get started?**
Just the URL of the website you want me to reference, plus any specific changes you want (different colors, different layout sections, etc.). If you have a Figma design or brand guidelines, even better. The more detail you provide upfront, the closer the first draft will be to your vision.

**4. Do you provide the original Figma/design file?**
The Premium package includes a component storybook that serves as your living design documentation. If you specifically need a Figma file, I can add that as a gig extra — just ask.

**5. What if I need changes after delivery?**
The Basic package includes 1 revision round, Standard includes 2, and Premium includes unlimited revisions within the scope of the original requirements. Additionally, Premium clients get 30 days of post-delivery bug-fix support."""


def snap(page, name):
    """Screenshot to Gooodsky directory"""
    path = os.path.join(SCREENSHOT_DIR, name)
    try:
        page.screenshot(path=path)
        print(f"  [SCREENSHOT] {name}")
    except Exception as e:
        print(f"  [WARN] Screenshot failed {name}: {e}")


def wait(seconds=2):
    time.sleep(seconds)


def find_and_fill(page, selectors, text, field_name="field"):
    """Try multiple selectors to find and fill an input"""
    for sel in selectors:
        try:
            el = page.query_selector(sel)
            if el and el.is_visible():
                el.click()
                wait(0.5)
                el.fill('')
                wait(0.3)
                el.fill(text)
                print(f"  [OK] {field_name} filled (selector: {sel})")
                return True
        except Exception:
            continue
    print(f"  [WARN] Could not find {field_name}")
    return False


def find_and_click(page, selectors, name="button"):
    """Try multiple selectors to find and click an element"""
    for sel in selectors:
        try:
            el = page.query_selector(sel)
            if el and el.is_visible():
                el.click()
                print(f"  [OK] Clicked {name} (selector: {sel})")
                return True
        except Exception:
            continue
    print(f"  [WARN] Could not find {name}")
    return False


def main():
    print("=" * 60)
    print("Fiverr Gig 1: Website Clone & Redesign")
    print("=" * 60)

    ctx = None
    page = None

    try:
        # ======== 1. Launch browser ========
        print("\n[1/8] Launching CloakBrowser...")
        ctx = launch_context(
            headless=False,
            humanize=True,
            human_preset='careful',
            viewport={'width': 1280, 'height': 800},
            storage_state='C:/Users/Administrator/clk-session.json',
        )
        page = ctx.new_page()
        print("  Browser launched")
        wait(3)

        # ======== 2. Navigate to Create Gig page ========
        print("\n[2/8] Navigating to Create Gig page...")
        page.goto(
            'https://www.fiverr.com/users/gooodsky/manage_gigs/new?wizard=0&tab=general',
            wait_until='domcontentloaded',
            timeout=30000
        )
        wait(5)
        snap(page, "gig1-01-landing.png")
        print(f"  Current URL: {page.url}")

        # Check if login is needed
        if 'login' in page.url.lower():
            print("  [ERROR] Need to re-login! Session may have expired.")
            print("  Please login manually in the opened browser window.")
            print("  Script will wait 120 seconds...")
            time.sleep(120)
            page.goto(
                'https://www.fiverr.com/users/gooodsky/manage_gigs/new?wizard=0&tab=general',
                wait_until='domcontentloaded',
                timeout=30000
            )
            wait(5)

        # ======== 3. Fill OVERVIEW TAB ========
        print("\n[3/8] === Filling Overview Tab ===")

        # 3a. Title
        print("  Filling title...")
        find_and_fill(page, [
            'input[name="title"]',
            '[data-testid="gig-title-input"]',
            '[data-cy="gig-title-input"]',
            '.gig-title input',
            '[class*="title"] input[type="text"]',
            'input[placeholder*="title" i]',
            'input[placeholder*="gig title" i]',
            'input[placeholder*="service title" i]',
        ], GIG_TITLE, "Title")
        wait(3)

        # 3b. Tags
        print("  Filling search tags...")
        for i, tag in enumerate(TAGS):
            print(f"    Tag {i+1}/5: {tag}")
            tag_input_sel = [
                '[class*="tag"] input',
                'input[placeholder*="tag" i]',
                'input[placeholder*="search" i]',
                '[data-testid*="tag"] input',
            ]
            found = False
            for sel in tag_input_sel:
                try:
                    el = page.query_selector(sel)
                    if el and el.is_visible():
                        el.click()
                        wait(1)
                        el.fill(tag)
                        wait(1.5)
                        page.keyboard.press('Enter')
                        wait(2)
                        found = True
                        print(f"    [OK] Tag added")
                        break
                except Exception:
                    continue
            if not found:
                print(f"    [WARN] Could not find tag input")

        wait(2)
        snap(page, "gig1-02-overview.png")

        # 3c. Save & Continue
        print("  Clicking Save & Continue...")
        find_and_click(page, [
            'button:has-text("Save & Continue")',
            'button:has-text("Save and Continue")',
            'button:has-text("Continue")',
            '[data-testid*="save"]',
            '[data-cy*="save"]',
            'footer button[type="submit"]',
            'footer button[type="button"]',
        ], "Save & Continue")
        wait(5)
        snap(page, "gig1-03-after-save.png")
        print(f"  Current URL: {page.url}")

        # ======== 4. Fill PRICING TAB ========
        print("\n[4/8] === Filling Pricing Tab ===")

        # If page didn't auto-advance, navigate manually
        if 'pricing' not in page.url.lower():
            print("  Manually navigating to Pricing tab...")
            page.goto(
                'https://www.fiverr.com/users/gooodsky/manage_gigs/new?wizard=0&tab=pricing',
                wait_until='domcontentloaded',
                timeout=15000
            )
            wait(5)

        snap(page, "gig1-04-pricing-landing.png")

        # Fill three pricing packages
        pricing_data = [
            {
                "label": "Basic",
                "name_sel": [
                    'input[id*="basic" i][id*="name" i]',
                    'input[name*="basic" i]',
                    '[class*="basic"] [class*="title"] input',
                    'input[placeholder*="package name" i]',
                ],
                "price_sel": [
                    'input[id*="basic" i][id*="price" i]',
                    'input[name*="basic" i][type="number"]',
                    '[class*="basic"] [class*="price"] input',
                    'input[placeholder*="price" i]',
                ],
                "delivery_sel": [
                    'input[id*="basic" i][id*="delivery" i]',
                    '[class*="basic"] [class*="delivery"] input',
                ],
                "desc_sel": [
                    'textarea[id*="basic" i]',
                    '[class*="basic"] textarea',
                ],
                "name": "Single Page Clone",
                "price": "150",
                "delivery": "3",
                "desc": "1 landing page. Next.js 15+ + Tailwind CSS 4. Desktop + Mobile responsive. Basic SEO meta tags. Clean source code. 1 revision round. 3-day delivery."
            },
            {
                "label": "Standard",
                "name_sel": [
                    'input[id*="standard" i][id*="name" i]',
                    'input[name*="standard" i]',
                    '[class*="standard"] [class*="title"] input',
                ],
                "price_sel": [
                    'input[id*="standard" i][id*="price" i]',
                    'input[name*="standard" i][type="number"]',
                    '[class*="standard"] [class*="price"] input',
                ],
                "delivery_sel": [
                    'input[id*="standard" i][id*="delivery" i]',
                    '[class*="standard"] [class*="delivery"] input',
                ],
                "desc_sel": [
                    'textarea[id*="standard" i]',
                    '[class*="standard"] textarea',
                ],
                "name": "Multi-Page Clone",
                "price": "300",
                "delivery": "5",
                "desc": "Up to 5 pages. Next.js 15+ + TypeScript. Desktop + Tablet + Mobile. Full SEO + Open Graph. Image optimization + code splitting. Basic CSS transitions. 1 functional contact form. Documented code + README. Vercel deployment guide. 2 revision rounds. 5-day delivery."
            },
            {
                "label": "Premium",
                "name_sel": [
                    'input[id*="premium" i][id*="name" i]',
                    'input[name*="premium" i]',
                    '[class*="premium"] [class*="title"] input',
                ],
                "price_sel": [
                    'input[id*="premium" i][id*="price" i]',
                    'input[name*="premium" i][type="number"]',
                    '[class*="premium"] [class*="price"] input',
                ],
                "delivery_sel": [
                    'input[id*="premium" i][id*="delivery" i]',
                    '[class*="premium"] [class*="delivery"] input',
                ],
                "desc_sel": [
                    'textarea[id*="premium" i]',
                    '[class*="premium"] textarea',
                ],
                "name": "Full Redesign + Deploy",
                "price": "500",
                "delivery": "7",
                "desc": "Up to 10 pages. Next.js 15+ + TypeScript. Pixel-perfect all devices. Advanced SEO + Schema markup + Sitemap. Lighthouse 90+ score. Advanced Framer Motion animations. Multi-step forms with validation. Up to 2 external APIs. Fully documented + Component storybook. Live Vercel deployment. Unlimited revisions. 7-day delivery. 30 days support."
            },
        ]

        for pkg in pricing_data:
            print(f"  Filling {pkg['label']} package...")

            # Try to fill package name
            find_and_fill(page, pkg['name_sel'], pkg['name'], f"{pkg['label']} name")

            # Try to fill price
            find_and_fill(page, pkg['price_sel'], pkg['price'], f"{pkg['label']} price")

            # Try to fill delivery time
            find_and_fill(page, pkg['delivery_sel'], pkg['delivery'], f"{pkg['label']} delivery")

            # Try to fill package description
            find_and_fill(page, pkg['desc_sel'], pkg['desc'], f"{pkg['label']} description")
            wait(1)

        snap(page, "gig1-05-pricing-filled.png")

        # Save & Continue
        print("  Clicking Save & Continue...")
        find_and_click(page, [
            'button:has-text("Save & Continue")',
            'button:has-text("Save and Continue")',
            'button:has-text("Continue")',
            'footer button[type="submit"]',
        ], "Save & Continue")
        wait(5)

        # ======== 5. Fill DESCRIPTION & FAQ TAB ========
        print("\n[5/8] === Filling Description & FAQ Tab ===")

        if 'description' not in page.url.lower() and 'desc' not in page.url.lower():
            print("  Manually navigating to Description tab...")
            page.goto(
                'https://www.fiverr.com/users/gooodsky/manage_gigs/new?wizard=0&tab=description',
                wait_until='domcontentloaded',
                timeout=15000
            )
            wait(5)

        snap(page, "gig1-06-description-landing.png")

        # Fill description
        print("  Filling Gig description...")
        find_and_fill(page, [
            'textarea[id*="description" i]',
            'textarea[name*="description" i]',
            '[class*="description"] textarea',
            'div[contenteditable="true"]',
            '[role="textbox"]',
        ], DESCRIPTION, "Description")
        wait(3)

        # Fill FAQ
        print("  Filling FAQ...")
        find_and_click(page, [
            'button:has-text("Add FAQ")',
            'button:has-text("+ Add")',
            '[data-testid*="add-faq"]',
        ], "Add FAQ button")
        wait(2)

        find_and_fill(page, [
            'textarea[id*="faq" i]',
            'textarea[name*="faq" i]',
            '[class*="faq"] textarea',
        ], FAQ_TEXT, "FAQ")

        snap(page, "gig1-07-description-filled.png")

        # Save & Continue
        print("  Clicking Save & Continue...")
        find_and_click(page, [
            'button:has-text("Save & Continue")',
            'button:has-text("Save and Continue")',
            'button:has-text("Continue")',
            'footer button[type="submit"]',
        ], "Save & Continue")
        wait(5)

        # ======== 6. Fill GALLERY TAB ========
        print("\n[6/8] === Filling Gallery Tab ===")

        if 'gallery' not in page.url.lower():
            print("  Manually navigating to Gallery tab...")
            page.goto(
                'https://www.fiverr.com/users/gooodsky/manage_gigs/new?wizard=0&tab=gallery',
                wait_until='domcontentloaded',
                timeout=15000
            )
            wait(5)

        snap(page, "gig1-08-gallery-landing.png")

        # Upload cover image
        print("  Uploading cover image...")
        file_uploaded = False
        for sel in [
            'input[type="file"]',
            '[data-testid*="upload"] input[type="file"]',
            '[class*="upload"] input[type="file"]',
            '[data-cy*="upload"] input[type="file"]',
        ]:
            try:
                el = page.query_selector(sel)
                if el:
                    el.set_input_files(GIG1_COVER)
                    print(f"  [OK] Cover image uploaded")
                    file_uploaded = True
                    wait(5)
                    break
            except Exception:
                continue

        if not file_uploaded:
            print("  [WARN] Could not find file upload input")

        snap(page, "gig1-09-gallery-filled.png")

        # Save & Continue
        print("  Clicking Save & Continue...")
        find_and_click(page, [
            'button:has-text("Save & Continue")',
            'button:has-text("Save and Continue")',
            'button:has-text("Continue")',
            'footer button[type="submit"]',
        ], "Save & Continue")
        wait(5)

        # ======== 7. PUBLISH ========
        print("\n[7/8] === Publishing Gig ===")

        if 'publish' not in page.url.lower():
            print("  Manually navigating to Publish tab...")
            page.goto(
                'https://www.fiverr.com/users/gooodsky/manage_gigs/new?wizard=0&tab=publish',
                wait_until='domcontentloaded',
                timeout=15000
            )
            wait(5)

        snap(page, "gig1-10-publish-page.png")

        # Click Publish
        print("  Clicking Publish button...")
        published = find_and_click(page, [
            'button:has-text("Publish Gig")',
            'button:has-text("Publish")',
            '[data-testid*="publish"]',
            '[data-cy*="publish"]',
        ], "Publish")

        if published:
            print("  [OK] Publish button clicked!")
        else:
            print("  [WARN] Could not find publish button, leaving browser open for manual review")
            print("  Script will wait 60 seconds for manual action...")
            time.sleep(60)

        wait(5)
        snap(page, "gig1-11-final.png")

        # ======== 8. Done ========
        print("\n[8/8] Gig 1 creation flow completed!")
        print("  Check the final state in the browser.")
        print("  Script will close browser in 30 seconds...")
        time.sleep(30)

    except Exception as e:
        print(f"\n[ERROR] Script failed: {e}")
        traceback.print_exc()
        if page:
            try:
                snap(page, "gig1-ERROR.png")
            except:
                pass
        print("\nBrowser stays open 60 seconds for manual handling...")
        time.sleep(60)

    finally:
        if ctx:
            print("Closing browser...")
            try:
                ctx.close()
            except:
                pass
            try:
                if hasattr(ctx, 'browser') and ctx.browser:
                    ctx.browser.close()
            except:
                pass
        print("Gig 1 script ended.")


if __name__ == '__main__':
    main()
