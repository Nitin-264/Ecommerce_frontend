import { Button } from '@headlessui/react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React from 'react'
import Link from '@mui/material/Link'

const Footer = () => {
  return (
    <div>
      <Grid
        container
        spacing={4}
        className="bg-black text-white text-center mt-10"
        sx={{ bgcolor: 'black', color: 'white', py: 5 }}
      >
        {/* Column 1 */}
        <Grid item xs={12} sm={6} md={3} >
          <Typography className="pb-5" variant="h6">Company</Typography>
          {['About', 'Blog', 'Press', 'Job', 'Partner'].map((text) => (
            <div key={text}>
              <Button className="pb-2">{text}</Button>
            </div>
          ))}
        </Grid>

        {/* Column 2 */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography className="pb-5" variant="h6">Solutions</Typography>
          {['Marketing', 'Analytics', 'Commerce', 'Insights', 'Support'].map((text) => (
            <div key={text}>
              <Button className="pb-2">{text}</Button>
            </div>
          ))}
        </Grid>

        {/* Column 3 */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography className="pb-5" variant="h6">Documentation</Typography>
          {['Guide', 'API Status'].map((text) => (
            <div key={text}>
              <Button className="pb-2">{text}</Button>
            </div>
          ))}
        </Grid>

        {/* Column 4 */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography className="pb-5" variant="h6">Legal</Typography>
          {['Claim', 'Privacy', 'Terms'].map((text) => (
            <div key={text}>
              <Button className="pb-2">{text}</Button>
            </div>
          ))}
        </Grid>

       <Grid item xs={12}>
  <Typography variant="body2" align="center" sx={{ mt: 6, mb: 1 }}>
    &copy; 2023 My Company. All rights reserved.
  </Typography>
  <Typography variant="body2" align="center" sx={{ mb: 1 }}>
    Made with love by Me.
  </Typography>
  <Typography variant="body2" align="center">
    Icons made by{' '}
    <Link href="https://www.freepik.com" color="inherit" underline="always">
      Freepik
    </Link>{' '}
    from{' '}
    <Link href="https://www.flaticon.com" color="inherit" underline="always">
      www.flaticon.com
    </Link>
  </Typography>
</Grid>

      </Grid>
    </div>
  )
}

export default Footer
