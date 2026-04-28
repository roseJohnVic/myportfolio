import app from './app.js';
import { PORT, MONGO_URL } from './config.js';
import startDb from './db/dbConnection.js';

startDb(MONGO_URL); 


app.listen(PORT, () => {
  console.log(`Server running onn port ${PORT}`);
});


process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1); ///node process immediate stoped here 
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});




// error clarification 

// | Error type                                              | Where caught                               | Frontend toast                                          |
// | ------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------- |
// | Expected / validation (missing fields, 404)             | Controller → global handler                | Yes, show specific message                              |
// | Unexpected / coding bug / DB failure                    | `next(error)` → global handler             | Optionally show generic toast `"Internal Server Error"` |
// | Completely uncaught (outside routes / missed try/catch) | `uncaughtException` / `unhandledRejection` | No, server usually shuts down                           |

