# Jenkins: LCARS-Homelab stylesheet

`jenkins.css` styles **Jenkins 2.568** at level B. It was built against the core
stylesheets `simple-page.css` and `theme-dark.css` and 98 structure classes measured
in a signed-in Jenkins. No JavaScript, no DOM changes.

## Approach

Jenkins' own dark theme stays the base. The stylesheet translates Jenkins' 181
custom properties (background, text, links, cards, panes, tables, inputs, buttons,
focus, status, alerts, dialogs) into the Homelab roles. A few selectors add what
variables cannot express:

- a segmented LCARS bar on `.jenkins-header__main` whose gold segment runs into the
  breadcrumb row as an end cap;
- the gear emblem via `#jenkins-head-icon`, independent of the hashed logo path;
- pane elbows from a vertical gold edge and a segmented top bar;
- spaced capitals for pane and table headings;
- JetBrains Mono with tabular figures for table values, badges, times and data;
- LCARS round caps for buttons, hover glow, a 180 ms press flash and a double
  keyboard focus ring;
- a calm LCARS shape for tabs;
- a small static seven-segment bar in the footer - deliberately not animated,
  Jenkins is a work area, not an ambient display.

Build status colours stay fully variable-driven: green, yellow and red are neither
merged nor filtered, and status icons keep Jenkins' own semantics. On the card
surface `#10131a` green reaches 7.36:1, gold 8.83:1 and red 5.01:1.

## Install

1. Keep Jenkins' **Dark Theme** active (theme-manager plugin).
2. Install the **Simple Theme** plugin.
3. Under **Manage Jenkins → Appearance → Theme elements** add a **CSS URL**:

   ```text
   https://theme.example.org/lcars-homelab/integrations/jenkins/jenkins.css
   ```

   (your base URL from `tools/build-dist.mjs`). Fonts and emblem are loaded from
   the same host.

If Jenkins runs with a Content Security Policy, allow that host for `style-src`,
`font-src` and `img-src`.

## Structure selectors to re-check after a Jenkins update

- header and search: `.jenkins-header`, `.jenkins-header__main`,
  `.jenkins-header--no-breadcrumbs`, `.jenkins-breadcrumbs`, `.app-jenkins-logo`,
  `#jenkins-head-icon`, `.jenkins-search__input`;
- side panel: `.pane`, `.pane-frame`, `.pane-header`, `.pane-header-title`,
  `.task-link`;
- job table and metadata: `.jenkins-table`, `.jenkins-table__link`,
  `.jenkins-table__cell--tight`, `.sortheader`,
  `.jenkins-jobs-list__item__details`, `.jenkins-badge`, `time` and `data` elements
  in tables;
- buttons: `.jenkins-button`, `.jenkins-button--primary`,
  `.jenkins-button--tertiary`;
- tabs: `.tabBarFrame`, `.tabBar`, `.tabBarBaseline`, `.tab`, `.addTab`;
- footer sequence: `.page-footer__flex-row`;
- sign-in and loading: `.app-sign-in-register__*`, `.jenkins-input`,
  `.simple-page .safe-restarting`, `.jenkins-spinner`, `.behavior-loading`,
  `.app-jenkins-booting`.

Also look at: header with and without breadcrumbs in narrow and wide windows, build
queue and executor panes, sorting and status icons in the job table, tabs with long
titles, hover/focus/press/disabled, forced colours, reduced motion, build history,
running builds, pipeline views and console output (their structure was not
measured and stays variable-driven).

## Uninstall

Remove the CSS URL from the Simple Theme plugin and clear the browser cache. No
Jenkins files are replaced.
