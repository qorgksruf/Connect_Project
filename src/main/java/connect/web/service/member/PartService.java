package connect.web.service.member;

import connect.web.domain.member.PartDto;
import connect.web.domain.member.PartEntity;
import connect.web.domain.member.PartEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PartService {

    @Autowired PartEntityRepository partEntityRepository;

    // 부서등록하기
    public boolean addPart( PartDto partDto ){

        PartEntity partEntity = partEntityRepository.save( partDto.toEntity() );
        if( partEntity.getPartNo() > 0 ){
            return true;
        }
        return false;
    }

    // 부서 정보 가져오기
    public List<PartDto> getPart() {

        List<PartEntity> partEntityList = partEntityRepository.findAll();

        List<PartDto> list = new ArrayList<>();

        partEntityList.forEach( (p) ->{
            list.add( p.toDto() );
        });

        return list;
    }

    // 부서 이름 수정하기
    @Transactional
    public boolean editPart( PartDto partDto ){

        Optional<PartEntity> optionalPartEntity = partEntityRepository.findById(partDto.getPartNo());

        if( optionalPartEntity.isPresent() ){
            PartEntity partEntity = optionalPartEntity.get();
            partEntity.setPartName( partDto.getPartName() );
            return true;
        }

        return false;
    }


    // 부서 삭제하기
    public boolean deletePart( int partNo ){

        Optional<PartEntity> optionalPartEntity = partEntityRepository.findById(partNo);

        if( optionalPartEntity.isPresent() ){
            PartEntity partEntity = optionalPartEntity.get();
            partEntityRepository.delete(partEntity);
            return true;
        }

        return false;
    }



}
