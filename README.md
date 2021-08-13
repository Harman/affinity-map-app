# Affinity Map App
This is a front-end app made using javascript, html, css and bootstrap. It allows user to organize various sticky notes on the screen.

### Basic features are:
- Sticky notes can be dragged and placed anywhere on the screen using the drag button on top left corner of each note.
- To create the note use the button to the left of "delete bin" icon. It will open a dialog box which can be used to set various properties like textual content, color, tag etc.
- Every note can be given a tag property, this property can be used to only view notes which have a particular tag, using the "filter by tag:" dropdown menu. 
- Even after their creation, every note is editable, just click on them and change the note content.
- Every note have a unique id which helps distinguish between notes having same content.
- To delete any note, just click on "delete bin" icon, it will acitivate the delete mode, clicking on any note will delete that note, clicking again on "delete bin" icon deactivates the delete mode.
- Whether delete mode is active or not can be seen by a "blue" border arround the delete button, which is visible when delete mode is on.
- User can also create buckets or backboards for the notes, these backboards can be resized to accommodate any number of notes over them and are themselves dragable too.
- Backboards/buckets can be created using "Group Highlights" button. We can also move notes from one board to the other.
- Every bucket have a title, delete button and drag button. Clicking delete button deletes that particular bucket.
- Zoom in and out buttons can be used to increase/decrease the view of our grid or main whiteboard which contains all the notes and buckets. 
- Both buckets and our main whiteboard/grid are resize able to accommodate new buckets/notes. To resize them use the bottom left corner and resize according to your desire.
- Finally all the notes/buckets are stored in the local storage of user's browser and are available even after reloading the website. Any change made in the notes are instantly reflected in the local storage.
- Future ideas: Every note have a unique id which can be replaced by unique user id to distinguish between notes by different users.

## Known Bug
- When zooming out of the grid, it breaks postioning code of the dragging notes/buckets part, due to which the notes/ buckets are not at current cursor position.