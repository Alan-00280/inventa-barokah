import TextLink from "../textLink"

export default function Footer() {
    return (
        <footer className="bg-barokah-900 text-gray-300 py-10 px-6 md:px-20 ring-white inset-ring-1">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                {/* Brand Description */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Inventa Barokah</h3>
                    <p className="text-sm leading-relaxed mb-3">
                        Inventa Barokah adalah marketplace yang menyediakan berbagai kebutuhan sehari-hari.
                    </p>
                    <p className="text-sm">Made with 💗 by <span className="text-pink-400 font-medium">Alan</span></p>
                </div>

                {/* Social Media */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Social Media</h4>
                    <ul className="space-y-2">
                        <li><TextLink href="#" text="Youtube"/></li>
                        <li><TextLink href="#" text="Twitter"/></li>
                        <li><TextLink href="#" text="Facebook"/></li>
                    </ul>
                </div>

                {/* Contact Us */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Contact Us</h4>
                    <ul className="space-y-2">
                        <li><TextLink href="#" text="WhatsApp"/></li>
                        <li><TextLink href="#" text="Email"/></li>
                    </ul>
                </div>
            </div>

            <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
                © 2025 Inventa Barokah. All rights reserved.
            </div>
        </footer>
    )
}