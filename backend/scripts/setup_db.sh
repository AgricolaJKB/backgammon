# create db/database.db in backend folder
# if not exists
if [ ! -f db/database.db ]; then
    touch db/database.db
fi

# iterate trough tables in schemas folder
# and create tables in db/database.db
for file in schemas/*.sql; do
    sqlite3 db/database.db < $file
done