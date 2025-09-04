import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from './app/app.config'
import { AppComponent } from './app/components/app.component'
;(async () => {
  try {
    await bootstrapApplication(AppComponent, appConfig)
  } catch (err) {
    console.error(err)
  }
})()
