# Mozilla IAM Site Checker

This is an in-development add-on that puts a small green checkmark in the
address bar for sites on which it is safe to use your Mozilla credentials on.
On other sites there is a hidden page action in the menu that shows a red X
and a note that it is not safe to use your Mozilla IAM credentials on this
site.

The list of sites is hard coded into the add-on. The current list is:

* `auth.mozilla.auth0.com`
* `login.mozilla.com`

# Development

```
yarn install --frozen-lockfile
yarn build
```

A built add-on will be placed in `./web-ext-artifacts/`.