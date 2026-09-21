-- Grant least-privilege appuser access to all application databases (V8 fix)
CREATE DATABASE IF NOT EXISTS `orderdb`;
GRANT ALL PRIVILEGES ON `orderdb`.* TO 'appuser'@'%';

CREATE DATABASE IF NOT EXISTS `deliverydb`;
GRANT ALL PRIVILEGES ON `deliverydb`.* TO 'appuser'@'%';

FLUSH PRIVILEGES;
