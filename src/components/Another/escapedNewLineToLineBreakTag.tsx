// escapedNewLineToLineBreakTag.tsx
import React from 'react'
// show giới thiệu truyện và show content chapter
// Thay /n -> <br>
interface Props {
  string: string
}

const EscapedNewLineToLineBreakTag: React.FC<Props> = ({ string }) => {
  return (
    <>
      {string.split('\n').map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />} {/* Thêm <br> sau dòng thứ nhất */}
          <p className='break-words'>{item}</p>
        </React.Fragment>
      ))}
    </>
  )
}

export default EscapedNewLineToLineBreakTag
