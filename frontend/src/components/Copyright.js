import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
export default function Copyright() {
    return (
      <div >
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, mb: 4 }}>
        {'Copyright © '}
        {' '}
        {' ('}
        {new Date().getFullYear()}
        {').'}
      </Typography>
      </div>
    );
  }