/**
 * @jest-environment jsdom
 */

 const fs = require('fs');
 const path = require('path');
 const html = fs.readFileSync(path.resolve(__dirname, '../registration.html'), 'utf8');
 
 
 describe('registration.html', () => {
     
     beforeEach(() => {
         document.documentElement.innerHTML = html.toString();
     })
 
     describe('head', () => {
         test('Title exists', () => {
             const title = document.querySelector('head > title');
             expect(title).toBeTruthy();
             expect(title.textContent).toBe('Registration');
         });
 
         test('there is a favicon'), () => {
             const head = document.querySelector('head');
             expect(head.textContent).toContain('link rel="icon"');
         };
         
         test('there is a css stylesheet', () => {
             const head = document.querySelector('head');
             expect(head.textContent).toContain('link rel="stylesheet"');
         });
 
     });
 
     describe('body', () => {
 
         test('main body contains a registration form', () => {
             const registrationForm = document.querySelector('register');
             expect(registrationForm).toBeTruthy();
         });
     });
 
        describe('form', () => {
            
            describe('inputs', () => {
                test('it has a required input field for username with a character limit of 30', () => {
                    const userNameInput = document.querySelector('#username');
                    expect(userNameInput).toBeTruthy(); 
                    expect(userNameInput.getAttribute('maxlength')).toBe('30');
                    expect(userNameInput.getAttribute('required')).toBeTruthy();
                });

                test('it has a required input field for email with a character limit of 100', () => {
                    const emailInput = document.querySelector('#email');
                    expect(emailInput).toBeTruthy(); 
                    expect(emailInput.getAttribute('maxlength')).toBe('100');
                    expect(emailInput.getAttribute('required')).toBeTruthy();
                });
                test('it has a required password input field with a character limit of 100', () => {
                    const passwordInput = document.querySelector('#password');
                    expect(passwordInput).toBeTruthy();
                    expect(passwordInput.getAttribute('type')).toBe('password');
                    expect(passwordInput.getAttribute('required')).toBeTruthy();
                    expect(passwordInput.getAttribute('maxlength')).toBe('100');
                });
                test('it has a submit button', () => {
                    const submit = document.querySelector('#register-submit');
                    expect(submit).toBeTruthy();
                    expect(submit.getAttribute('type')).toBe('submit');
                });
                });
            describe('return to login link', () => {
                test('it has a descriptive anchor link back to the login page', () => {
                    const returnToLogin = document.querySelector('.back-to-login');
                    expect(returnToLogin).toBeTruthy();
                    const lowerCaseLink = returnToLogin.textContent.toLowerCase();
                    expect(lowerCaseLink.textContent).toContain(`already have an account`);
                    expect(lowerCaseLink.textContent).toContain('login');
                    expect(lowerCaseLink.textContent).toContain('href=index.html');
                });
            });
        });
 });
