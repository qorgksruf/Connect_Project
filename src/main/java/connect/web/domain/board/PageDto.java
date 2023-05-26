package connect.web.domain.board;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data@NoArgsConstructor@AllArgsConstructor@Builder
public class PageDto {
    private int totalPage;                  // 1. 전체 페이지수
    private List<BoardDto> boardDtoList;    // 2. 현재 페이지의 게시물정보(dto)들
    private int page;                       // 3. 현재 페이지번호
    private int partNo;                     // 4. 현재 부서 번호
    private String key;                     // 5. 검색할 필드명
    private String keyword;                 // 6. 검색어
}
