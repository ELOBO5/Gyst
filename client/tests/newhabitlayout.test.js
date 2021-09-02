/**
 * @jest-environment jsdom
 */

 const fs = require('fs');
 const path = require('path');
 const html = fs.readFileSync(path.resolve(__dirname, '../newhabit.html'), 'utf8');
 
 
 describe('newhabit.html', () => {
     
     beforeEach(() => {
         document.documentElement.innerHTML = html.toString();
     })
 
     describe('head', () => {
         test('Title exists', () => {
             const title = document.querySelector('head > title');
             expect(title).toBeTruthy();
             expect(title.textContent).toBe('GYST');
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
         describe('nav', () => {
            test('there is a nav bar', () => {
                const nav = document.querySelector('nav');
                expect(nav).toBeTruthy();
            });
            test('nav contains anchor links', () => {
                const anchor = document.querySelector('a');
                ///not sure if this is the right way to check if nav contains anchor elements?
                expect(nav).toContain(anchor);
                expect(anchor.textContent).toContain('href=');
                const
            });
        });
            
         test('main body contains a new habit form', () => {
             const registrationForm = document.querySelector('register');
             expect(registrationForm).toBeTruthy();
         });
     });
 
        describe('form', () => {
            
            describe('inputs', () => {
                test('it has a required input field for the habit with a character limit of 40', () => {
                    const habitInput = document.querySelector('#habit-entry');
                    expect(habitInput).toBeTruthy(); 
                    expect(habitInput.getAttribute('maxlength')).toBe('40');
                    expect(habitInput.getAttribute('required')).toBeTruthy();
                    expect(habitInput.getAttribute('type')).toBe('text');
                });

                test('it has a required input field for email with a character limit of 100', () => {
                    const frequencyInput = document.querySelector('#habit-frequency');
                    expect(frequencyInput).toBeTruthy(); 
                    expect(frequencyInput.getAttribute('type')).toBe('select');
                });

                test('it has a non-required checkbox priority field', () => {
                    const priorityInput = document.querySelector('#habit-priority');
                    expect(priorityInput).toBeTruthy();
                    expect(priorityInput.getAttribute('type')).toBe('checkbox');
                    expect(priorityInput.getAttribute('required')).toBeFalsy();
                });

                test('it has a submit button', () => {
                    const submit = document.querySelector('#habit-submit');
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

        describe('footer', () => {
            test('footer exists', () => {
                const footer = document.querySelector('footer');
                expect(footer).toBeTruthy();
            });
        });
 });
