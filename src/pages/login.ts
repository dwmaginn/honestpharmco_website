import { generateHTMLHead, generateNavigation, generateFooter } from '../utils/page-template';
import siteContent from '../content/site-content.json';

export async function renderLoginPage() {
  const { title, metaDescription } = siteContent.pages.login;
  const { form } = siteContent.pages.login;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    ${generateHTMLHead({ 
      title, 
      description: metaDescription,
      keywords: siteContent.site.keywords
    })}
</head>
<body class="bg-black">
    ${generateNavigation()}

    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold text-gray-900">Sign in to your account</h2>
                <p class="mt-2 text-gray-600">Or create a new account to see pricing</p>
            </div>

            <!-- Login Form -->
            <div id="login-form" class="bg-white shadow-xl rounded-lg p-8">
                <form class="space-y-6" onsubmit="return handleLogin(event)">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-300">${form.emailLabel}</label>
                        <input type="email" id="email" name="email" required 
                               placeholder="${form.emailPlaceholder}"
                               class="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gold/20 rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-gold focus:border-gold">
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-300">${form.passwordLabel}</label>
                        <input type="password" id="password" name="password" required 
                               placeholder="${form.passwordPlaceholder}"
                               class="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gold/20 rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-gold focus:border-gold">
                    </div>
                    <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Sign In
                    </button>
                </form>
                <div class="mt-6 text-center">
                    <button onclick="showRegisterForm()" class="text-green-600 hover:text-green-700 font-medium">
                        Need an account? Register here
                    </button>
                </div>
            </div>

            <!-- Registration Form (hidden by default) -->
            <div id="register-form" class="bg-white shadow-xl rounded-lg p-8 hidden">
                <form class="space-y-4" onsubmit="return handleRegister(event)">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Email *</label>
                            <input type="email" name="reg_email" required 
                                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Password *</label>
                            <input type="password" name="reg_password" required 
                                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Company Name</label>
                            <input type="text" name="company_name" 
                                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Contact Name *</label>
                            <input type="text" name="contact_name" required 
                                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="tel" name="phone" 
                                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">License Number</label>
                            <input type="text" name="license_number" 
                                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" name="address" 
                               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>

                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">City</label>
                            <input type="text" name="city" 
                                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">State</label>
                            <input type="text" name="state" maxlength="2" 
                                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Zip</label>
                            <input type="text" name="zip" 
                                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        </div>
                    </div>

                    <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Register Account
                    </button>
                </form>
                <div class="mt-4 text-center">
                    <button onclick="showLoginForm()" class="text-green-600 hover:text-green-700 font-medium">
                        Already have an account? Sign in
                    </button>
                </div>
            </div>

            <div id="message" class="hidden p-4 rounded-lg text-center"></div>
        </div>
    </div>

    <script src="/static/js/auth.js"></script>
</body>
</html>
  `
}